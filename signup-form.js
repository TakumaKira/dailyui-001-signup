import 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'
import 'https://unpkg.com/labeled-input'

const template = document.createElement('template')
const elements = `
  <form id="form">
    <h1 id="title"></h1>

    <labeled-input
      id="email-input"
      type="text"
    ></labeled-input>
    <span id="email-error" class="error"></span>

    <labeled-input
      id="password-input"
      type="password"
    ></labeled-input>
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
    labeled-input {
      width: 100%;
    }
    .error {
      font-size: 15px;
      align-self: flex-start;
      margin-top: 5px;
      margin-bottom: 15px;
      margin-left: 5px;
      color: var(--error-message-color)
    }
    #button {
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
  constructor() {
    super()
    this.attach()
    this.getElements()
    this.initializeParams()
  }
  connectedCallback() {
    this.loadFont()
    this.setEventListeners()
    this.render()
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) {
      return
    }
    this.updateParams(name, newVal)
    this.render()
  }

  attach() {
    this.root = this.attachShadow({mode: 'closed'})
    this.root.appendChild(template.content.cloneNode(true))
  }
  getElements() {
    this.rootElem = this.root.host
    this.titleElem = this.root.querySelector('#title')
    this.formElem = this.root.querySelector('#form')
    this.emailInputElem = this.root.querySelector('#email-input')
    this.emailErrorElem = this.root.querySelector('#email-error')
    this.passwordInputElem = this.root.querySelector('#password-input')
    this.passwordErrorElem = this.root.querySelector('#password-error')
    this.buttonElem = this.root.querySelector('#button')
    this.completeElem = this.root.querySelector('#complete')
  }
  loadFont() {
    if (!this.fontGoogle) {
      return
    }
    WebFont.load({
      google: {
        families: [
          `${this.fontGoogle}:${this.fontWeight}`,
        ]
      }
    })
  }
  setEventListeners() {
    // Submit events
    this.formElem.onsubmit = e => {
      // Prevent page reload
      e.preventDefault()

      // Validation
      const detail = {
        email: this.emailInputElem.value,
        password: this.passwordInputElem.value
      }

      const constraints = {
        email: {
          email: true,
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

    // Hide error message on next input
    this.emailInputElem.oninput = e => {
      this.emailErrorElem.textContent = ''
    }
    this.passwordInputElem.oninput = e => {
      this.passwordErrorElem.textContent = ''
    }
  }

  static get observedAttributes() {
    return [
      // Layout
      'width',

      // Fonts
      'font-google',
      'font-fallback',
      'font-weight',
      'input-font-size',
      'label-font-size',

      // Texts
      'title',
      'email-label',
      'password-label',
      'submit-button-label',
      'complete-message',

      // Colors
      'background-color',
      'input-background-color',
      'title-color',
      'label-color',
      'input-color',
      'underline-color',
      'error-message-color',
      'button-background-color',
      'button-color',
      'complete-message-color',
    ]
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
    if (!this.inputFontSize) {
      this.inputFontSize = '1.5rem'
    }
    if (!this.labelFontSize) {
      this.labelFontSize = '1.2rem'
    }

    // Texts
    if (!this.title) {
      this.title = 'Sign Up'
    }
    if (!this.emailLabel) {
      this.emailLabel = 'Email'
    }
    if (!this.passwordLabel) {
      this.passwordLabel = 'Password'
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
    if (!this.inputBackgroundColor) {
      this.inputBackgroundColor = 'transparent'
    }
    if (!this.titleColor) {
      this.titleColor = '#FFFFFF'
    }
    if (!this.labelColor) {
      this.labelColor = 'rgba(255, 255, 255, 0.5)'
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
      case 'input-font-size':
        this.inputFontSize = newVal
        break
      case 'label-font-size':
        this.labelFontSize = newVal
        break

      // Texts
      case 'title':
        this.title = newVal
        break
      case 'email-label':
        this.emailLabel = newVal
        break
      case 'password-label':
        this.passwordLabel = newVal
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
      case 'input-background-color':
        this.inputBackgroundColor = newVal
        break
      case 'title-color':
        this.titleColor = newVal
        break
      case 'label-color':
        this.labelColor = newVal
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
    if (this.fontGoogle) {
      this.rootElem.style.setProperty('--font-family', `'${this.fontGoogle}', ${this.fontFallback}`)
    } else {
      this.rootElem.style.setProperty('--font-family', this.fontFallback)
    }
    this.rootElem.style.setProperty('--font-weight', this.fontWeight)
    this.emailInputElem.setAttribute('font-family', `'${this.fontGoogle}', ${this.fontFallback}`)
    this.emailInputElem.setAttribute('font-weight', this.fontWeight)
    this.emailInputElem.setAttribute('font-size', this.inputFontSize)
    this.emailInputElem.setAttribute('label-font-size', this.labelFontSize)
    this.emailInputElem.setAttribute('background-color', this.inputBackgroundColor)
    this.passwordInputElem.setAttribute('font-family', `'${this.fontGoogle}', ${this.fontFallback}`)
    this.passwordInputElem.setAttribute('font-weight', this.fontWeight)
    this.passwordInputElem.setAttribute('font-size', this.inputFontSize)
    this.passwordInputElem.setAttribute('label-font-size', this.labelFontSize)
    this.passwordInputElem.setAttribute('background-color', this.inputBackgroundColor)

    // Texts
    this.titleElem.textContent = this.title
    this.emailInputElem.setAttribute('label', this.emailLabel)
    this.passwordInputElem.setAttribute('label', this.passwordLabel)
    this.buttonElem.textContent = this.submitButtonLabel
    this.completeElem.textContent = this.completeMessage

    // Colors
    this.rootElem.style.setProperty('--background-color', this.backgroundColor)
    this.rootElem.style.setProperty('--title-color', this.titleColor)
    this.emailInputElem.setAttribute('label-color', this.labelColor)
    this.emailInputElem.setAttribute('input-color', this.inputColor)
    this.emailInputElem.setAttribute('underline-color', this.underlineColor)
    this.passwordInputElem.setAttribute('label-color', this.labelColor)
    this.passwordInputElem.setAttribute('input-color', this.inputColor)
    this.passwordInputElem.setAttribute('underline-color', this.underlineColor)
    this.rootElem.style.setProperty('--error-message-color', this.errorMessageColor)
    this.rootElem.style.setProperty('--button-background-color', this.buttonBackgroundColor)
    this.rootElem.style.setProperty('--button-color', this.buttonColor)
    this.rootElem.style.setProperty('--complete-message-color', this.completeMessageColor)
  }
}

window.customElements.define('signup-form', SignupForm)
