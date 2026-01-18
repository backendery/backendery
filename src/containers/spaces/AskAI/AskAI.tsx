import './AskAI.scss';

import axios from 'axios';
import axiosRetry from 'axios-retry';
import { Field, Form, Formik, type FormikHelpers } from 'formik';
import { OverlayScrollbars } from 'overlayscrollbars';
import { type FC, useEffect, useRef, useState } from 'react';
import { ReactTyped as Typed } from 'react-typed';
import * as Yup from 'yup';

import SvgIcon from '~/components/elements/Icon';
import { useApp } from '~/contexts/App';

type AskAIFormValues = {
  message: string;
};

type AskAIMessage = {
  content: string;
  id: string;
  role: Role;
};

const Role = { Assistant: 'assistant', User: 'user' } as const;
// annotation
type Role = (typeof Role)[keyof typeof Role];

/**
 * Toggles the body's scroll behavior by setting or removing the 'fixed' position style. This is
 * used to disable or enable scrolling when an input field gains or loses focus.
 * @function
 * @param {boolean} shouldDisable If true, the body's position is set to 'fixed', disabling
 * scrolling. If false, the position is reset to allow scrolling.
 */
const toggleBodyScroll = (shouldDisable: boolean) => {
  if (shouldDisable && document.body.style.position !== 'fixed') {
    document.body.style.position = 'fixed';
  } else if (!shouldDisable && document.body.style.position === 'fixed') {
    document.body.style.position = '';
  }
};

/**
 * Handles the 'focus' and 'blur' events on input fields. When an input field is focused, scrolling
 * is disabled, and when it loses focus, scrolling is re-enabled.
 * @function
 * @param {Event} event The event triggered (focus or blur). It is checked if it's a FocusEvent to
 * handle accordingly.
 */
const handleInputFocusEvent = (event: Event) => {
  if (event instanceof FocusEvent) {
    event.type === 'focus' ? toggleBodyScroll(true) : toggleBodyScroll(false);
  }
};

/**
 * Event handler to prevent form submission when the "Enter" key is pressed. It checks if the event
 * is a keyboard event targeting the "Enter" key, preventing the default form submission behavior.
 * @function
 * @param {React.KeyboardEvent<HTMLFormElement>} event The keyboard event triggered on a form.
 */
const handleKeyDownEvent = (event: React.KeyboardEvent<HTMLFormElement>) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent default form submit behavior when Enter is pressed
    event.currentTarget.requestSubmit();
  }
};

const REQUEST_MAX_REDIRECTS = 0 as number;
const REQUEST_TIMEOUT = 45_000 as number;
const REQUEST_RETRIES = 3 as number;

// Create an axios instance to set the interceptors
const axiosInstance = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  // Disable automatic redirects
  maxRedirects: REQUEST_MAX_REDIRECTS,
  timeout: REQUEST_TIMEOUT,
});

// Retry up to 3 times on failed requests
axiosRetry(axiosInstance, { retries: REQUEST_RETRIES });

// Store reference to setMessages function for interceptors
const setMessagesRef: React.RefObject<React.Dispatch<React.SetStateAction<AskAIMessage[]>> | null> = {
  current: null,
};
const THINKING_MESSAGE_ID = "thinking-message-id";

// Interceptor for processing before request
axiosInstance.interceptors.request.use(
  (config) => {
    if (setMessagesRef.current) {
      const thinkingMessage: AskAIMessage = {
        content: "I'm thinking...",
        id: THINKING_MESSAGE_ID,
        role: Role.Assistant,
      };
      setMessagesRef.current((msg) => [...msg, thinkingMessage]);
    }
    return config;
  },
  async (error) => {
    throw error;
  },
);

// Interceptor for processing after request
axiosInstance.interceptors.response.use(
  (response) => {
    // Remove thinking message after successful response
    if (setMessagesRef.current) {
      setMessagesRef.current((msg) => msg.filter((x) => x.id !== THINKING_MESSAGE_ID));
    }
    return response;
  },
  async (error) => {
    // Remove thinking message on error
    if (setMessagesRef.current) {
      setMessagesRef.current((msg) => msg.filter((x) => x.id !== THINKING_MESSAGE_ID));
    }
    throw error;
  },
);

const AskAI: FC = () => {
  /**
   * Handler for form submission. Resets the form after sending the message (or performing the
   * desired action). This method could also handle actual submission logic, like sending data to an
   * API.
   * @function
   * @param {AskAIFormValues} values The form values submitted by the user.
   * @param {FormikHelpers<AskAIFormValues>} actions Formik helper methods to manage the form
   * state. These helpers allow you to reset, validate, or set specific form field values.
   */
  /* prettier-ignore */
  const handleSendMessage = async (
		values: AskAIFormValues, actions: FormikHelpers<AskAIFormValues>
	) => {
		if (!values.message.trim()) return;

		try {
			const userMessage: AskAIMessage = {
				content: values.message.trim(),
				id: crypto.randomUUID(),
				role: Role.User,
			};
			setMessages((msg) => [...msg, userMessage]);

			// Let's clean the form
			actions.resetForm();

			const response = await axiosInstance.post("/api/ask-ai", {
				userPrompt: userMessage.content,
			});
			const { answer } = response.data;

      const aiMessage: AskAIMessage = {
				content: answer,
				id: crypto.randomUUID(),
				role: Role.Assistant,
			};
			setMessages((msg) => [...msg, aiMessage]);
		} catch(err) {
			setMessages((msg) => [
				...msg,
				{
					content: "Error :/\nPlease try again later",
					id: crypto.randomUUID(),
					role: Role.Assistant,
				},
			]);
		} finally {
			actions.setSubmitting(false);
		}
	};

  /**
   * @states
   */
  const [messages, setMessages] = useState<AskAIMessage[]>([]);

  /**
   * @references
   */
  const chatScrollbarsRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  /**
   * @hooks
   */
  const { scrollbarsOptions } = useApp();

  let osInstance: OverlayScrollbars | undefined;

  const Schema: Yup.ObjectSchema<AskAIFormValues> = Yup.object().shape({
    /**
     * User message
     */
    message: Yup.string()
      .trim()
      .required('message is required')
      .min(2, 'less than 002 symbols').max(96, 'more then 096 symbols'), // prettier-ignore
  });

  /**
   * Initial form values with predefined structure (type `AskAIFormValues`), including
   * default value for message
   */
  const initialFormValues: AskAIFormValues = { message: '' };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  }, [messages]);

  useEffect(() => {
    // Find all `input` and `textarea` elements on page
    const inputs = document.querySelectorAll('input, textarea');

    // Add event listeners for focus and blur
    for (const input of inputs) {
      input.addEventListener('focus', handleInputFocusEvent);
      input.addEventListener('blur', handleInputFocusEvent);
    }

    return () => {
      // Clean up event listeners on component unmount
      for (const input of inputs) {
        input.removeEventListener('focus', handleInputFocusEvent);
        input.removeEventListener('blur', handleInputFocusEvent);
      }
    };
  }, []);

  useEffect(() => {
    if (chatScrollbarsRef?.current) {
      osInstance = OverlayScrollbars(chatScrollbarsRef?.current, scrollbarsOptions);
    }
    return () => osInstance?.destroy();
  }, [osInstance, scrollbarsOptions]);

  // Sync setMessages with interceptors
  useEffect(() => {
    setMessagesRef.current = setMessages;
    return () => {
      setMessagesRef.current = null;
    };
  }, []);

  return (
    <div className="ask-ai">
      <h2 className="ask-ai__title">
        <Typed cursorChar="_" showCursor startWhenVisible strings={['Ask AI']} typeSpeed={50} />
      </h2>
      <div className="ask-ai__chat">
        <div className="ask-ai__chat-inner" data-overlayscrollbars-initialize ref={chatScrollbarsRef}>
          {messages.length === 0 ? (
            <div className="ask-ai__intro-wrapper">
              <div className="ask-ai__intro">
                <p className="ask-ai__intro--title">Start a conversation with AI</p>
                <div className="ask-ai__intro--hint">What do you build?</div>
                <div className="ask-ai__intro--hint">Is Backendery a good fit for our type of project?</div>
                <div className="ask-ai__intro--hint">How do you usually start a new project?</div>
                <div className="ask-ai__intro--hint">What's your tech stack?</div>
              </div>
            </div>
          ) : (
            <div className="ask-ai__conversation">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`ask-ai__message ask-ai__message--${msg.role}`}
                >
                  <div className={`ask-ai__message-content ${msg.id === THINKING_MESSAGE_ID ? 'is-thinking' : ''}`}>{msg.content}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        <Formik
          initialValues={initialFormValues}
          onSubmit={(values, actions) => {
            Schema.validate(values, { abortEarly: false })
              .then(() => {
                handleSendMessage(values, actions);
              })
              .catch((error) => {
                const errors: { [key: string]: string } = {};
                for (const validationError of error.inner as Yup.ValidationError[]) {
                  if (validationError.path) {
                    errors[validationError.path] = validationError.message;
                  }
                }
                actions.setErrors(errors);
              });
          }}
          validateOnBlur={false}
          validateOnChange
          validationSchema={Schema}
        >
          {(
            /* prettier-ignore */
            {
							errors,
							isSubmitting,
							setFieldError,
							setFieldTouched,
							setFieldValue,
							submitCount,
							touched,
							values,
						},
          ) => (
            <Form onKeyDown={handleKeyDownEvent} className="ask-ai__chat-form">
              <div className="ask-ai-input">
                <Field
                  className="ask-ai-input__field"
                  id="message"
                  name="message"
                  disabled={isSubmitting}
                  autoComplete="off"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFieldValue('message', event.target.value);
                    setFieldTouched('message', true, false);
                    // Validate the value based on the input
                    Schema.validateAt('message', {
                      message: event.target.value,
                    })
                      .then(() => setFieldError('message', ''))
                      .catch((error) => {
                        setFieldError('message', error.message);
                      });
                  }}
                />
                <label className={`ask-ai-input__label ${values.message && 'label-top'}`} htmlFor="message">
                  Ask anything
                </label>
                {submitCount > 0 && errors.message && touched.message && (
                  <div className="ask-ai-input__error">{errors.message}</div>
                )}
              </div>
              <button className="ask-ai__send-message-btn" disabled={isSubmitting || !!errors.message} type="submit">
                <SvgIcon name="arrow-up" />
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AskAI;
