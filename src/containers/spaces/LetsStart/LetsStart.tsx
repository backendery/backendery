import './LetsStart.scss';

import axios from 'axios';
import axiosRetry from 'axios-retry';
import { Field, Form, Formik, type FormikHelpers } from 'formik';
import { OverlayScrollbars } from 'overlayscrollbars';
import { useEffect, useRef, useState } from 'react';
import { ReactTyped as Typed } from 'react-typed';
import * as Yup from 'yup';

import AnimateSignalStrip from '~/components/AnimateSignalStrip/AnimateSignalStrip';
import SvgIcon from '~/components/elements/Icon';
import { useApp } from '~/contexts/App';

type LetsStartFormValues = {
  email: string;
  isAgreePrivacyPolicy: boolean;
  maxBudget: number;
  minBudget: number;
  name: string;
  projectDescription: string;
};

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
    switch (event.type) {
      case 'focus':
        toggleBodyScroll(true);
        return;

      case 'blur':
        toggleBodyScroll(false);

      default:
    }
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
  }
};

/**
 * Updates the content of a modal dialog.
 * @function
 * @param {string} title The text to be displayed as the modal's title.
 * @param {string} description The text to be displayed as the modal's description.
 */
const updateSubmittingModalContent = (title: string, description: string): void => {
  const titleElt = document.querySelector('.lets-start__submitting-modal-title');
  const descriptionElt = document.querySelector('.lets-start__submitting-modal-description');

  if (titleElt) {
    titleElt.textContent = title;
  }

  if (descriptionElt) {
    descriptionElt.textContent = description;
  }
};

const REQUEST_MAX_REDIRECTS = 0 as number;
const REQUEST_BASE_URL = import.meta.env.VITE_LETS_START_FORM_API_ORIGIN as string;
const REQUEST_TIMEOUT = 5_000 as number;
const REQUEST_RETRIES = 3 as number;

// Create an axios instance to set the interceptors
const axiosInstance = axios.create({
  baseURL: REQUEST_BASE_URL,
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

// Interceptor for processing before request
axiosInstance.interceptors.request.use(
  (config) => {
    /* prettier-ignore */
    updateSubmittingModalContent(
      "Wait...",
      "One moment. We're sending your message right now."
    );

    return config;
  },
  async (error) => {
    throw error;
  },
);

// Interceptor for processing after request
axiosInstance.interceptors.response.use(
  (response) => {
    // Update the title and description after a successful response
    /* prettier-ignore */
    updateSubmittingModalContent(
      "Thank You!",
      "Your message has been successfully sent! We'll contact you ASAP."
    );

    return response;
  },
  async (error) => {
    // Update title and description in case of error
    /* prettier-ignore */
    updateSubmittingModalContent(
      "Uh-oh!",
      "Sorry, but something went wrong. Please, try again later."
    );

    throw error;
  },
);

const LetsStart: React.FC = () => {
  /**
   * Handler for form submission. Resets the form after sending the message (or performing the
   * desired action). This method could also handle actual submission logic, like sending data to an
   * API.
   * @function
   * @param {LetsStartFormValues} values The form values submitted by the user.
   * @param {FormikHelpers<LetsStartFormValues>} actions Formik helper methods to manage the form
   * state. These helpers allow you to reset, validate, or set specific form field values.
   */
  /* prettier-ignore */
  const handleSendMessage = async (
    values: LetsStartFormValues, actions: FormikHelpers<LetsStartFormValues>
  ) => {
    openSubmittingModal();

    try {
      // Bring the budget fields to a number
      const preparedValues: LetsStartFormValues = {
        ...values,
        maxBudget: Number(values.maxBudget),
        minBudget: Number(values.minBudget),
      };
      // Sending data via axios with interceptors
      const response = await axiosInstance.post('/api/v1/send-message', preparedValues);
      if (response.status === axios.HttpStatusCode.Ok) {
        // Reset the form fields to their initial values after submission
        actions.resetForm();
      }
    } catch (error) {
      console.error(error);
    } finally {
       // Un-disabled button
      actions.setSubmitting(false);
    }
  };

  /**
   * Opens the submitting modal window.
   * @function
   */
  const openSubmittingModal = () => {
    setIsSubmittingModalOpen(true);
  };

  /**
   * Closes the submitting modal window.
   * @function
   */
  const closeSubmittingModal = () => {
    setIsSubmittingModalOpen(false);
  };

  /**
   * Opens the privacy policy modal window.
   * @function
   */
  const openPrivacyPolicyModal = () => {
    setIsPrivacyPolicyModalOpen(true);
  };

  /**
   * Closes the privacy policy modal window.
   * @function
   */
  const closePrivacyPolicyModal = () => {
    setIsPrivacyPolicyModalOpen(false);
  };

  /**
   * @states
   */
  const [isSubmittingModalOpen, setIsSubmittingModalOpen] = useState<boolean>(false);
  const [isPrivacyPolicyModalOpen, setIsPrivacyPolicyModalOpen] = useState<boolean>(false);

  /**
   * @references
   */
  const privacyPolicyModalScrollbarsRef = useRef<HTMLDivElement | null>(null);

  /**
   * @hooks
   */
  const { scrollbarsOptions } = useApp();

  let osInstance: OverlayScrollbars | undefined;

  /* prettier-ignore */
  const Schema: Yup.ObjectSchema<LetsStartFormValues> = Yup.object().shape({
    /**
     * What inbox to answer you at?
     */
    email: Yup.string()
      .required("@mail is required")
      .test(
        'is valid email', '@mail is incorrect', (email) => {
          return !email || /^[\w%+.-]+@[\d.A-Za-z-]+\.[A-Za-z]{2,}$/.test(email);
        }
      ),
    /**
     * Whether the user agrees to the privacy policy?
     */
    isAgreePrivacyPolicy: Yup.boolean()
      .required().oneOf([true]).default(false),
    /**
     * How much is the maximum budget?
     */
    maxBudget: Yup.number()
      .required("max is required")
      .min(1_000, "less than $1000").max(50_000, "more than $50.000")
      .when("minBudget", (minBudget, schema) => {
        const [value] = minBudget;
        return value !== undefined && typeof value === "number"
          ? schema.moreThan(value, "less than $ Min")
          : schema;
      }),
    /**
     * How much is the minimum budget?
     */
    minBudget: Yup.number()
      .required("min is required")
      .min(1_000, "less than $1000").max(50_000, "more than $50.000")
      .when("maxBudget", (maxBudget, schema) => {
        const [value] = maxBudget;
        return value !== undefined && typeof value === "number"
          ? schema.lessThan(value, "more than $ Max")
          : schema;
      }),
    /**
     * Who you are?
     */
    name: Yup.string()
      .required("name is required")
      .min(2, "less than 002 symbols").max(32, "more than 032 symbols"),
    /**
     * Tell us about your idea or project or what you need in general?
     */
    projectDescription: Yup.string()
      .required("an about the project is required")
      .min(64, "less than 064 symbols").max(512, "more than 512 symbols")
  },
    [
      ["minBudget", "maxBudget"]
    ]
  );

  /**
   * Initial form values with predefined structure (interface `ILetsStartFormValues`), including
   * default values for name, email, projectDescription, and budget ranges.
   */
  const initialFormValues: LetsStartFormValues = {
    email: '',
    isAgreePrivacyPolicy: false,
    maxBudget: 50_000,
    minBudget: 1_000,
    name: '',
    projectDescription: '',
  };

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
    if (privacyPolicyModalScrollbarsRef?.current) {
      osInstance = OverlayScrollbars(privacyPolicyModalScrollbarsRef?.current, scrollbarsOptions);
    }

    return () => osInstance?.destroy();
  }, [isPrivacyPolicyModalOpen]);

  return (
    <div className="lets-start">
      {isSubmittingModalOpen && (
        <div className="lets-start__submitting-modal">
          <h2 className="lets-start__submitting-modal-title" />
          <p className="lets-start__submitting-modal-description" />
          <button className="lets-start__submitting-modal-close-btn" onClick={closeSubmittingModal}>
            OK
          </button>
        </div>
      )}
      {isPrivacyPolicyModalOpen && (
        <div className="lets-start__privacy-policy-modal">
          <h2 className="lets-start__privacy-policy-modal-title">Privacy Policy</h2>
          {/* prettier-ignore */}
          <div className="lets-start__privacy-policy-modal-text" data-overlayscrollbars-initialize ref={privacyPolicyModalScrollbarsRef}>
            <div className="lets-start__privacy-policy-modal-text__paragraph">
              <h4 className="lets-start__privacy-policy-modal-text__paragraph-title">Introduction</h4>
              <p className="lets-start__privacy-policy-modal-text__paragraph-text">
                {`At Backendery, we are committed to protecting your personal information and privacy. This Privacy Policy
                explains how we collect, use, and protect the information you provide through our "Let's Start" form on
                our website. By submitting your data, you agree to this Privacy Policy.`}
              </p>
            </div>
            <div className="lets-start__privacy-policy-modal-text__paragraph">
              <h4 className="lets-start__privacy-policy-modal-text__paragraph-title">1. Data We Collect</h4>
              <p className="lets-start__privacy-policy-modal-text__paragraph-text">
                {`Through the "Let's Start" form, we collect the following information to assess our interest in your
                project and respond if applicable:`}
                <ul>
                  <li>Your name</li>
                  <li>Your email address</li>
                  <li>Project details</li>
                  <li>Minimum and maximum project budget</li>
                </ul>
              </p>
            </div>
            <div className="lets-start__privacy-policy-modal-text__paragraph">
              <h4 className="lets-start__privacy-policy-modal-text__paragraph-title">2. Purpose of Data Collection</h4>
              <p className="lets-start__privacy-policy-modal-text__paragraph-text">
                {`The information provided in the "Let's Start" form is collected solely to evaluate potential projects and
                to reach out if your proposal aligns with our company's services and interests.`}
              </p>
            </div>
            <div className="lets-start__privacy-policy-modal-text__paragraph">
              <h4 className="lets-start__privacy-policy-modal-text__paragraph-title">3. Data Processing and Retention</h4>
              <p className="lets-start__privacy-policy-modal-text__paragraph-text">
                {`When you submit the "Let's Start" form, your information is immediately transmitted to our secure email
                inbox. We do not store your data on external servers or in any long-term database. The information may
                either be deleted after initial review or remain in our email inbox if further communication continues as
                part of an ongoing email thread.`}
              </p>
            </div>
            <div className="lets-start__privacy-policy-modal-text__paragraph">
              <h4 className="lets-start__privacy-policy-modal-text__paragraph-title">4. Data Security</h4>
              <p className="lets-start__privacy-policy-modal-text__paragraph-text">
               {` We ensure that all submitted data is handled securely. Your information is solely used for the purpose of
                evaluating project opportunities and is not shared with any third parties. The data is transmitted
                securely and remains accessible only to the internal team via our email server.`}
              </p>
            </div>
            <div className="lets-start__privacy-policy-modal-text__paragraph">
              <h4 className="lets-start__privacy-policy-modal-text__paragraph-title">5. User Rights</h4>
              <p className="lets-start__privacy-policy-modal-text__paragraph-text">
                {`In compliance with GDPR, you have the right to access, correct, and delete your personal information.
                However, due to the limited and temporary nature of our data handling (data is only retained in an email
                format), it may not be possible to delete or modify your information once submitted, as it resides solely
                in the email exchange thread.`}
              </p>
            </div>
            <div className="lets-start__privacy-policy-modal-text__paragraph">
              <h4 className="lets-start__privacy-policy-modal-text__paragraph-title">6. Policy Updates</h4>
              <p className="lets-start__privacy-policy-modal-text__paragraph-text">
                {`This Privacy Policy may be updated occasionally to reflect changes in our practices. Any changes will be
                posted on this page. We encourage you to review this Privacy Policy periodically for the latest
                information on our data protection practices.`}
              </p>
            </div>
            <div className="lets-start__privacy-policy-modal-text__paragraph">
              <h4 className="lets-start__privacy-policy-modal-text__paragraph-title">Contact Information</h4>
              <p className="lets-start__privacy-policy-modal-text__paragraph-text">
                If you have any questions about this Privacy Policy, please contact us at
                {" "}{"["}
                <a className="lets-start__privacy-policy-modal-text__paragraph-email-address" href="mailto:hi@backendery.digital">
                  hi@backendery.digital
                </a>
                {"]"}{"."}
              </p>
            </div>
          </div>
          <button className="lets-start__privacy-policy-modal-close-btn" onClick={closePrivacyPolicyModal}>
            I've got it
          </button>
        </div>
      )}
      <h2 className="lets-start__title">
        <Typed cursorChar="_" showCursor startWhenVisible strings={["Let's start"]} typeSpeed={50} />
      </h2>
      <h3 className="lets-start__description">Fill in the blanks and we'll respond in one business day</h3>
      <div className="lets-start__decorative-animate-signal-strip-wrapper">
        <AnimateSignalStrip
          initialSymbols="....."
          maxInterval={2_500}
          maxNumberOfSymbols={5}
          minInterval={1_250}
          style={{ color: '#00df82' }}
          symbol="."
        />
      </div>
      <p className="lets-start__decorative-abstract-phrase">You've got mail in /var/mail/...</p>
      <div className="lets-start__decorative-rectangle" />
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
            values
          },
        ) => (
          <div className="lets-start__form-wrapper">
            <Form onKeyDown={handleKeyDownEvent}>
              <div className="lets-start__form">
                <div className="lets-start__inputs-wrapper">
                  <div className="lets-start-input">
                    <Field
                      className="lets-start-input__field"
                      id="name"
                      name="name"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue('name', event.target.value);
                        setFieldTouched('name', true, false);
                        // Validate the value based on the input
                        Schema.validateAt('name', { name: event.target.value })
                          .then(() => setFieldError('name', ''))
                          .catch((error) => {
                            setFieldError('name', error.message);
                          });
                      }}
                    />
                    <label className={`lets-start-input__label ${values.name && 'label-top'}`} htmlFor="name">
                      What's your name?
                    </label>
                    {submitCount > 0 && errors.name && touched.name && (
                      <div className="lets-start-input__error">{errors.name}</div>
                    )}
                  </div>
                  <div className="lets-start-input">
                    <Field
                      className="lets-start-input__field"
                      id="email"
                      name="email"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue('email', event.target.value);
                        setFieldTouched('email', true, false);
                        // Validate the value based on the input
                        Schema.validateAt('email', { email: event.target.value })
                          .then(() => setFieldError('email', ''))
                          .catch((error) => {
                            setFieldError('email', error.message);
                          });
                      }}
                    />
                    <label className={`lets-start-input__label ${values.email && 'label-top'}`} htmlFor="email">
                      Your @mail?
                    </label>
                    {submitCount > 0 && errors.email && touched.email && (
                      <div className="lets-start-input__error">{errors.email}</div>
                    )}
                  </div>
                  <div className="lets-start-input lets-start__project-description">
                    <Field
                      className="lets-start-input__field"
                      id="projectDescription"
                      name="projectDescription"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue('projectDescription', event.target.value);
                        setFieldTouched('projectDescription', true, false);
                        // Validate the value based on the input
                        Schema.validateAt('projectDescription', { projectDescription: event.target.value })
                          .then(() => setFieldError('projectDescription', ''))
                          .catch((error) => {
                            setFieldError('projectDescription', error.message);
                          });
                      }}
                    />
                    <label
                      className={`lets-start-input__label ${values.projectDescription && 'label-top'}`}
                      htmlFor="projectDescription"
                    >
                      Tell us about the project
                    </label>
                    {submitCount > 0 && errors.projectDescription && touched.projectDescription && (
                      <div className="lets-start-input__error">{errors.projectDescription}</div>
                    )}
                  </div>
                  <div className="lets-start__budget">
                    <p className="lets-start__budget-title">What is the budget range for your project?</p>
                    <div className="lets-start-input">
                      <Field
                        className="lets-start-input__field"
                        id="minBudget"
                        name="minBudget"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          if (/^\d*$/.test(event.target.value)) {
                            // Allow only numbers
                            setFieldValue('minBudget', event.target.value);
                            setFieldTouched('minBudget', true, false);
                            // Validate the value based on the input
                            Schema.validateAt('minBudget', { minBudget: event.target.value })
                              .then(() => setFieldError('minBudget', ''))
                              .catch((error) => {
                                setFieldError('minBudget', error.message);
                              });
                          }
                        }}
                      />
                      <label
                        className={`lets-start-input__label ${values.minBudget && 'label-top'}`}
                        htmlFor="minBudget"
                      >
                        $ Min
                      </label>
                      {submitCount > 0 && errors.minBudget && touched.minBudget && (
                        <div className="lets-start-input__error">{errors.minBudget}</div>
                      )}
                    </div>
                    <div className="lets-start-input">
                      <Field
                        className="lets-start-input__field"
                        id="maxBudget"
                        name="maxBudget"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          if (/^\d*$/.test(event.target.value)) {
                            // Allow only numbers
                            setFieldValue('maxBudget', event.target.value);
                            setFieldTouched('maxBudget', true, false);
                            // Validate the value based on the input
                            Schema.validateAt('maxBudget', { maxBudget: event.target.value })
                              .then(() => setFieldError('maxBudget', ''))
                              .catch((error) => {
                                setFieldError('maxBudget', error.message);
                              });
                          }
                        }}
                      />
                      <label
                        className={`lets-start-input__label ${values.maxBudget && 'label-top'}`}
                        htmlFor="maxBudget"
                      >
                        $ Max
                      </label>
                      {submitCount > 0 && errors.maxBudget && touched.maxBudget && (
                        <div className="lets-start-input__error">{errors.maxBudget}</div>
                      )}
                    </div>
                  </div>
                  <div className="lets-start-input lets-start-input--privacy-policy">
                    <Field
                      className="lets-start-input__field--checkbox"
                      id="isAgreePrivacyPolicy"
                      name="isAgreePrivacyPolicy"
                      type="checkbox"
                    />
                    <p>
                      I agree to the{' '}
                      <span
                        className="lets-start-input lets-start-input--privacy-policy-link"
                        onClick={openPrivacyPolicyModal}
                      >
                        privacy policy
                      </span>
                    </p>
                  </div>
                </div>
                <button className="lets-start__send-message-btn" disabled={isSubmitting} type="submit">
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  <SvgIcon name="arrow-right" />
                </button>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default LetsStart;
