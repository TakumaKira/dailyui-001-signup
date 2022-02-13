import 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'

const template = document.createElement('template')
const elements = `
  <form id="form">
  <h1 id="title"></h1>

  <div id="email-input-wrapper" class="input-wrapper">
    <input id="email" name="email" type="text" placeholder=" " />
    <label id="email-placeholder" for="email"></label>
  </div>
  <span id="email-error" class="error"></span>

  <div id="password-input-wrapper" class="input-wrapper">
    <input id="password" name="password" type="password" placeholder=" " />
    <label id="password-placeholder" for="password"></label>
  </div>
  <span id="password-error" class="error"></span>

  <button id="button" type="submit"></button>
  </form>

  <h1 id="complete" hidden></h1>
`
const styles = `
  <style>
    :host {
      box-sizing: border-box;
      font-family: 'Poppins', sans-serif;
      font-weight: 300;
      padding: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    form {
      width: 400px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    h1 {
      font-weight: normal;
      margin-block-start: 0.3em;
      margin-block-end: 0.3em;
    }
    .input-wrapper {
      position: relative;
      width: 100%;
      margin-top: 15px;
      display: flex;
      align-items: center;
    }
    .input-wrapper::after {
      content: '';
      position: absolute;
      bottom: 0;
      width: 100%;
      background-color: #FFFFFF;
      height: 1px;
      transition: height 0.3s;
    }
    .input-wrapper.focus::after, .input-wrapper.has-value::after {
      height: 2px;
    }
    input {
      display: block;
      width: 95%;
      border: none;
      outline: none;
      background-color: transparent;
    }
    input[type="text"], input[type="password"] {
      font-family: 'Poppins', sans-serif;
      font-size: 16px;
      padding: 5px 10px;
      color: #FFFFFF;
    }
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active{
      -webkit-text-fill-color: #FFFFFF;
      -webkit-box-shadow: 0 0 0px 1000px rgba(0,0,0,0) inset;
      transition: background-color 5000s ease-in-out 0s;
    }
    label {
      position: absolute;
      margin-left: 10px;
      transform-origin: center left;
      transition: all 0.3s;
      color: #FFFFFF;
      opacity: 0.5;
    }
    input:focus + label, input:not(:placeholder-shown) + label {
      transform: translateY(-100%) scale(80%);
    }
    .error {
      font-size: 15px;
      align-self: flex-start;
      margin-top: 5px;
      margin-bottom: 15px;
      margin-left: 5px;
    }
    button {
      border-radius: 2px;
      border: none;
      font-size: 20px;
      font-family: 'Poppins', sans-serif;
      cursor: pointer;
      margin-top: 10px;
      padding: 5px 20px;
    }
  </style>
`
template.innerHTML = `
  ${elements}
  ${styles}
`

export class SignupForm extends HTMLElement {
  static get observedAttributes() {
    return [
      'title',
      'submit-button-title',
      'email-placeholder',
      'password-placeholder',
      'complete-message',
      'background-color',
      'button-background-color',
      'title-color',
      'button-color',
      'error-message-color',
      'complete-message-color',
    ]
  }

  constructor() {
    super()
    this.loadFont()
    this.getElements()
    this.setEventListeners()
  }

  connectedCallback() {
    this.initializeParams()
    this.render()
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) {
      return
    }
    this.updateParams(name, newVal)
    this.render()
  }

  loadFont() {
    WebFont.load({
      google: {
        families: [
          'Poppins:300',
        ]
      }
    })
  }

  getElements() {
    this.root = this.attachShadow({mode: 'closed'})
    this.root.appendChild(template.content.cloneNode(true))
    this.rootElem = this.root.host
    this.titleElem = this.root.querySelector('#title')
    this.formElem = this.root.querySelector('#form')
    this.emailInputWrapperElem = this.root.querySelector('#email-input-wrapper')
    this.emailElem = this.root.querySelector('#email')
    this.emailPlaceholderElem = this.root.querySelector('#email-placeholder')
    this.emailErrorElem = this.root.querySelector('#email-error')
    this.passwordInputWrapperElem = this.root.querySelector('#password-input-wrapper')
    this.passwordElem = this.root.querySelector('#password')
    this.passwordPlaceholderElem = this.root.querySelector('#password-placeholder')
    this.passwordErrorElem = this.root.querySelector('#password-error')
    this.buttonElem = this.root.querySelector('#button')
    this.completeElem = this.root.querySelector('#complete')
  }

  setEventListeners() {
    // Submit events
    this.formElem.onsubmit = e => {
      // Prevent page reload
      e.preventDefault()

      // Validation
      const detail = {
        email: e.target.elements.email.value,
        password: e.target.elements.password.value
      }
      const constraints = {
        email: {
          email: true
        },
        password: {
          length: {
            minimum: 8,
            maximum: 16,
          }
        }
      }
      const result = validate(detail, constraints)
      if (result) {
        if (result.email) {
          this.emailErrorElem.textContent = result.email[0]
        }
        if (result.password) {
          this.passwordErrorElem.textContent = result.password[0]
        }
        return
      }

      // Dispatch submit event
      this.buttonElem.dispatchEvent(new CustomEvent('submit', {
        detail,
        composed: true
      }))
      this.formElem.style.display = 'none'
      this.completeElem.removeAttribute('hidden')
    }

    // input change events
    this.emailElem.oninput = e => {
      // Add has-value class when having a value
      const hasValue = this.emailElem.value !== ''
      const original = this.emailInputWrapperElem.getAttribute('class')
      if (hasValue) {
        this.emailInputWrapperElem.setAttribute('class', this.addClass(original, 'has-value'))
      } else {
        this.emailInputWrapperElem.setAttribute('class', this.removeClass(original, 'has-value'))
      }

      // Hide error message on next input
      this.emailErrorElem.textContent = ''
    }
    this.passwordElem.oninput = e => {
      // Add has-value class when having a value
      const hasValue = this.passwordElem.value !== ''
      const original = this.passwordInputWrapperElem.getAttribute('class')
      if (hasValue) {
        this.passwordInputWrapperElem.setAttribute('class', this.addClass(original, 'has-value'))
      } else {
        this.passwordInputWrapperElem.setAttribute('class', this.removeClass(original, 'has-value'))
      }

      // Hide error message on next input
      this.passwordErrorElem.textContent = ''
    }

    // Add focus class when focused
    this.emailElem.onfocus = e => {
      const original = this.emailInputWrapperElem.getAttribute('class')
      this.emailInputWrapperElem.setAttribute('class', this.addClass(original, 'focus'))
    }
    this.emailElem.onblur = e => {
      const original = this.emailInputWrapperElem.getAttribute('class')
      this.emailInputWrapperElem.setAttribute('class', this.removeClass(original, 'focus'))
    }
    this.passwordElem.onfocus = e => {
      const original = this.passwordInputWrapperElem.getAttribute('class')
      this.passwordInputWrapperElem.setAttribute('class', this.addClass(original, 'focus'))
    }
    this.passwordElem.onblur = e => {
      const original = this.passwordInputWrapperElem.getAttribute('class')
      this.passwordInputWrapperElem.setAttribute('class', this.removeClass(original, 'focus'))
    }
  }

  addClass(original, newClass) {
    const classes = original.split(' ')
    if (classes.includes(newClass))
      return original
    classes.push(newClass)
    return classes.join(' ')
  }

  removeClass(original, oldClass) {
    const classes = original.split(' ')
    const filtered = classes.filter(c => c !== oldClass)
    return filtered.join(' ')
  }

  initializeParams() {
    if (!this.title) {
      this.title = 'Sign Up';
    }
    if (!this.submitButtonTitle) {
      this.submitButtonTitle = 'Sign Up';
    }
    if (!this.emailPlaceholder) {
      this.emailPlaceholder = 'Email';
    }
    if (!this.passwordPlaceholder) {
      this.passwordPlaceholder = 'Password';
    }
    if (!this.completeMessage) {
      this.completeMessage = 'Thank you!';
    }
    if (!this.backgroundColor) {
      this.backgroundColor = '#8f2a2a';
    }
    if (!this.buttonBackgroundColor) {
      this.buttonBackgroundColor = '#7c7c7c';
    }
    if (!this.titleColor) {
      this.titleColor = '#FFFFFF';
    }
    if (!this.buttonColor) {
      this.buttonColor = '#FFFFFF';
    }
    if (!this.errorMessageColor) {
      this.errorMessageColor = '#ff4242';
    }
    if (!this.completeMessageColor) {
      this.completeMessageColor = '#FFFFFF';
    }
  }

  updateParams(name, newVal) {
    switch(name) {
      case 'title':
        this.title = newVal;
        break;
      case 'submit-button-title':
        this.submitButtonTitle = newVal;
        break;
      case 'email-placeholder':
        this.emailPlaceholder = newVal;
        break;
      case 'password-placeholder':
        this.passwordPlaceholder = newVal;
        break;
      case 'complete-message':
        this.completeMessage = newVal;
        break;
      case 'background-color':
        this.backgroundColor = newVal;
        break;
      case 'button-background-color':
        this.buttonBackgroundColor = newVal;
        break;
      case 'title-color':
        this.titleColor = newVal;
        break;
      case 'button-color':
        this.buttonColor = newVal;
        break;
      case 'error-message-color':
        this.errorMessageColor = newVal;
        break;
      case 'complete-message-color':
        this.completeMessageColor = newVal;
        break;
    }
  }

  render() {
    this.titleElem.textContent = this.title
    this.buttonElem.textContent = this.submitButtonTitle
    this.emailPlaceholderElem.textContent = this.emailPlaceholder
    this.passwordPlaceholderElem.textContent = this.passwordPlaceholder
    this.completeElem.textContent = this.completeMessage
    this.rootElem.setAttribute('style', `background-color: ${this.backgroundColor}`)
    this.titleElem.setAttribute('style', `color: ${this.titleColor}`)
    this.buttonElem.setAttribute('style', `color: ${this.buttonColor}; background-color: ${this.buttonBackgroundColor}`)
    this.emailErrorElem.setAttribute('style', `color: ${this.errorMessageColor}`)
    this.passwordErrorElem.setAttribute('style', `color: ${this.errorMessageColor}`)
    this.completeElem.setAttribute('style', `color: ${this.completeMessageColor}`)
  }
}

window.customElements.define('signup-form', SignupForm)
