/* eslint-disable no-useless-escape */

const emailRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-])[A-Za-z\d!@#$%^&*(),.?":{}|<>_\-]{8,20}$/;

export const formValidations = {
  firstName: {
    minLength: 2,
    maxLength: 40
  },
  lastName: {
    minLength: 1,
    maxLength: 50
  },
  email: {
    regex: emailRegex
  },
  password: {
    minLength: 8,
    maxLength: 20,
    regex: passwordRegex
  }
};
