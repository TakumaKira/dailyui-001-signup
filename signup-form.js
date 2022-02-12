import 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'

const template = document.createElement('template')
template.innerHTML = `
  <form id="form">
    <h1 id="title"></h1>
    <input id="email" name="email" type="text" />
    <span id="email-error" class="error"></span>
    <input id="password" name="password" type="password" />
    <span id="password-error" class="error"></span>
    <button id="button" type="submit"></button>
  </form>

  <h1 id="complete" hidden></h1>

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
      width: 380px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    h1 {
      font-weight: normal;
      margin-block-start: 0.3em;
      margin-block-end: 0.3em;
    }
    input {
      margin: 4px auto;
      width: 95%;
      border-radius: 2px;
      border: none;
      outline: none;
    }
    input[type="text"], input[type="password"] {
      font-family: 'Poppins', sans-serif;
      font-size: 16px;
      padding: 5px 10px;
    }
    .error {
      font-size: 15px;
      align-self: flex-start;
      margin: 0 5px;
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
    this.emailElem = this.root.querySelector('#email')
    this.emailErrorElem = this.root.querySelector('#email-error')
    this.passwordElem = this.root.querySelector('#password')
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

    // Hide error message on next input
    this.emailElem.oninput = e => {
      this.emailErrorElem.textContent = ''
    }
    this.passwordElem.oninput = e => {
      this.passwordErrorElem.textContent = ''
    }
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
    this.emailElem.placeholder = this.emailPlaceholder
    this.passwordElem.placeholder = this.passwordPlaceholder
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
