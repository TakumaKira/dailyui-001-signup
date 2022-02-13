import 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'

const template = document.createElement('template')
const elements = `
  <form id="form">
    <h1 id="title"></h1>

    <div id="email-input-wrapper" class="input-wrapper">
      <input id="email" name="email" type="text" placeholder=" " autocapitalize="none" />
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
      font-family: var(--font-family);
      font-weight: var(--font-weight);
      padding: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--background-color);
    }
    #form {
      width: var(--width);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    h1 {
      font-weight: var(--font-weight);
      margin-block-start: 0.3em;
      margin-block-end: 0.3em;
    }
    #title {
      color: var(--title-color);
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
      background-color: var(--underline-color);
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
      font-family: var(--font-family);
      font-size: 18px;
      padding: 5px 10px;
      color: var(--input-color);
    }
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active{
      -webkit-text-fill-color: var(--input-color);
      -webkit-box-shadow: 0 0 0px 1000px rgba(0,0,0,0) inset;
      transition: background-color 5000s ease-in-out 0s;
    }
    label {
      position: absolute;
      margin-left: 10px;
      transform-origin: center left;
      transition: all 0.3s;
      color: var(--placeholder-color);
    }
    input:focus + label, input:not(:placeholder-shown) + label {
      transform: translateY(-110%) scale(0.8);
    }
    .error {
      font-size: 15px;
      align-self: flex-start;
      margin-top: 5px;
      margin-bottom: 15px;
      margin-left: 5px;
      color: var(--error-message-color)
    }
    button {
      border-radius: 2px;
      border: none;
      font-size: 20px;
      font-family: var(--font-family);
      cursor: pointer;
      margin-top: 10px;
      padding: 5px 20px;
      color: var(--button-color);
      background-color: var(--button-background-color);
    }

    #complete {
      color: var(--complete-message-color)
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
      // Layout
      'width',

      // Fonts
      'font-google',
      'font-fallback',
      'font-weight',

      // Texts
      'title',
      'submit-button-label',
      'email-placeholder',
      'password-placeholder',
      'complete-message',

      // Colors
      'background-color',
      'title-color',
      'placeholder-color',
      'input-color',
      'underline-color',
      'error-message-color',
      'button-background-color',
      'button-color',
      'complete-message-color',
    ]
  }

  constructor() {
    super()
    this.getElements()
    this.setEventListeners()
  }

  connectedCallback() {
    this.initializeParams()
    this.loadFont()
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
          `${this.fontGoogle}:${this.fontWeight}`,
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
      if (hasValue) {
        this.emailInputWrapperElem.classList.add('has-value')
      } else {
        this.emailInputWrapperElem.classList.remove('has-value')
      }

      // Hide error message on next input
      this.emailErrorElem.textContent = ''
    }
    this.passwordElem.oninput = e => {
      // Add has-value class when having a value
      const hasValue = this.passwordElem.value !== ''
      if (hasValue) {
        this.passwordInputWrapperElem.classList.add('has-value')
      } else {
        this.passwordInputWrapperElem.classList.remove('has-value')
      }

      // Hide error message on next input
      this.passwordErrorElem.textContent = ''
    }

    // Add focus class when focused
    this.emailElem.onfocus = e => {
      this.emailInputWrapperElem.classList.add('focus')
    }
    this.emailElem.onblur = e => {
      this.emailInputWrapperElem.classList.remove('focus')
    }
    this.passwordElem.onfocus = e => {
      this.passwordInputWrapperElem.classList.add('focus')
    }
    this.passwordElem.onblur = e => {
      this.passwordInputWrapperElem.classList.remove('focus')
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
    // Layout
    if (!this.width) {
      this.width = '400px'
    }

    // Fonts
    if (!this.fontGoogle) {
      this.fontGoogle = 'Poppins'
    }
    if (!this.fontFallback) {
      this.fontFallback = 'sans-serif'
    }
    if (!this.fontWeight) {
      this.fontWeight = 300
    }

    // Texts
    if (!this.title) {
      this.title = 'Sign Up'
    }
    if (!this.emailPlaceholder) {
      this.emailPlaceholder = 'Email'
    }
    if (!this.passwordPlaceholder) {
      this.passwordPlaceholder = 'Password'
    }
    if (!this.submitButtonLabel) {
      this.submitButtonLabel = 'Sign Up'
    }
    if (!this.completeMessage) {
      this.completeMessage = 'Thank you!'
    }

    // Colors
    if (!this.backgroundColor) {
      this.backgroundColor = '#8f2a2a'
    }
    if (!this.titleColor) {
      this.titleColor = '#FFFFFF'
    }
    if (!this.placeholderColor) {
      this.placeholderColor = 'rgba(255, 255, 255, 0.5)'
    }
    if (!this.inputColor) {
      this.inputColor = '#FFFFFF'
    }
    if (!this.underlineColor) {
      this.underlineColor = 'rgba(255, 255, 255, 0.75)'
    }
    if (!this.errorMessageColor) {
      this.errorMessageColor = '#ff4242'
    }
    if (!this.buttonBackgroundColor) {
      this.buttonBackgroundColor = '#7c7c7c'
    }
    if (!this.buttonColor) {
      this.buttonColor = '#FFFFFF'
    }
    if (!this.completeMessageColor) {
      this.completeMessageColor = '#FFFFFF'
    }
  }

  updateParams(name, newVal) {
    switch(name) {
      // Layout
      case 'width':
        this.width = newVal
        break

      // Fonts
      case 'font-google':
        this.fontGoogle = newVal
        break
      case 'font-fallback':
        this.fontFallback = newVal
        break
      case 'font-weight':
        this.fontWeight = newVal
        break

      // Texts
      case 'title':
        this.title = newVal
        break
      case 'email-placeholder':
        this.emailPlaceholder = newVal
        break
      case 'password-placeholder':
        this.passwordPlaceholder = newVal
        break
      case 'submit-button-label':
        this.submitButtonLabel = newVal
        break
      case 'complete-message':
        this.completeMessage = newVal
        break

      // Colors
      case 'background-color':
        this.backgroundColor = newVal
        break
      case 'title-color':
        this.titleColor = newVal
        break
      case 'placeholder-color':
        this.placeholderColor = newVal
        break
      case 'input-color':
        this.inputColor = newVal
        break
      case 'underline-color':
        this.underlineColor = newVal
        break
      case 'error-message-color':
        this.errorMessageColor = newVal
        break
      case 'button-background-color':
        this.buttonBackgroundColor = newVal
        break
      case 'button-color':
        this.buttonColor = newVal
        break
      case 'complete-message-color':
        this.completeMessageColor = newVal
        break
    }
  }

  render() {
    // Layout
    this.rootElem.style.setProperty('--width', this.width)

    // Fonts
    this.rootElem.style.setProperty('--font-family', `'${this.fontGoogle}', ${this.fontFallback}`)
    this.rootElem.style.setProperty('--font-weight', this.fontWeight)

    // Texts
    this.titleElem.textContent = this.title
    this.emailPlaceholderElem.textContent = this.emailPlaceholder
    this.passwordPlaceholderElem.textContent = this.passwordPlaceholder
    this.buttonElem.textContent = this.submitButtonLabel
    this.completeElem.textContent = this.completeMessage

    // Colors
    this.rootElem.style.setProperty('--background-color', this.backgroundColor)
    this.rootElem.style.setProperty('--title-color', this.titleColor)
    this.rootElem.style.setProperty('--placeholder-color', this.placeholderColor)
    this.rootElem.style.setProperty('--input-color', this.inputColor)
    this.rootElem.style.setProperty('--underline-color', this.underlineColor)
    this.rootElem.style.setProperty('--error-message-color', this.errorMessageColor)
    this.rootElem.style.setProperty('--button-background-color', this.buttonBackgroundColor)
    this.rootElem.style.setProperty('--button-color', this.buttonColor)
    this.rootElem.style.setProperty('--complete-message-color', this.completeMessageColor)
  }
}

window.customElements.define('signup-form', SignupForm)
