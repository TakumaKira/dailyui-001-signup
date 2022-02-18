import 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'

const template = document.createElement('template')
const elements = `
  <div id="labeled-input-wrapper">
    <input id="labeled-input" name="input" placeholder=" " autocapitalize="none" />
    <label id="labeled-input-label" for="input"></label>
  </div>
`
const styles = `
  <style>
    :host {
      font-family: var(--font-family);
      font-weight: var(--font-weight);
    }
    #labeled-input-wrapper {
      position: relative;
      width: 100%;
      padding-top: var(--padding-top);
      display: flex;
      align-items: center;
      background-color: var(--background-color);
    }
    #labeled-input-wrapper::after {
      content: '';
      position: absolute;
      bottom: 0;
      width: 100%;
      background-color: var(--underline-color);
      height: 1px;
      transition: height 0.3s;
    }
    #labeled-input-wrapper.focus::after, #labeled-input-wrapper.has-value::after {
      height: 2px;
    }
    #labeled-input {
      display: block;
      width: 95%;
      border: none;
      outline: none;
      background-color: transparent;
      font-family: var(--font-family);
      font-size: var(--font-size);
      padding: 5px 10px;
      color: var(--input-color);
    }
    #labeled-input:-webkit-autofill,
    #labeled-input:-webkit-autofill:hover,
    #labeled-input:-webkit-autofill:focus,
    #labeled-input:-webkit-autofill:active{
      -webkit-text-fill-color: var(--input-color);
      -webkit-box-shadow: 0 0 0px 1000px rgba(0,0,0,0) inset;
      transition: background-color 5000s ease-in-out 0s;
    }
    #labeled-input-label {
      position: absolute;
      margin-left: 10px;
      transform-origin: center left;
      transition: all 0.3s;
      color: var(--label-color);
      font-size: var(--label-font-size);
      pointer-events: none;
    }
    #labeled-input:focus + #labeled-input-label,
    #labeled-input:not(:placeholder-shown) + #labeled-input-label {
      transform: translateY(-110%) scale(0.8);
    }
  </style>
`
template.innerHTML = `
  ${elements}
  ${styles}
`

export class LabeledInput extends HTMLElement {
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
    this.wrapperElem = this.root.querySelector('#labeled-input-wrapper')
    this.inputElem = this.root.querySelector('#labeled-input')
    this.labelElem = this.root.querySelector('#labeled-input-label')
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
    // input change events
    this.inputElem.oninput = e => {
      this.value = e.target.value

      // Add has-value class when having a value
      const hasValue = this.inputElem.value !== ''
      if (hasValue) {
        this.wrapperElem.classList.add('has-value')
      } else {
        this.wrapperElem.classList.remove('has-value')
      }

      // Dispatch event on input
      this.inputElem.dispatchEvent(new CustomEvent('oninput', {
        detail: {
          value: e.target.value,
        },
        composed: true
      }))
    }

    // Add focus class when focused
    this.inputElem.onfocus = e => {
      this.wrapperElem.classList.add('focus')
    }
    this.inputElem.onblur = e => {
      this.wrapperElem.classList.remove('focus')
    }
  }

  static get observedAttributes() {
    return [
      // Fonts
      'font-google',
      'font-fallback',
      'font-weight',
      'font-size',
      'label-font-size',

      // Texts
      'label',

      // Type
      'type',

      // Colors
      'background-color',
      'input-color',
      'underline-color',
      'label-color',
    ]
  }
  initializeParams() {
    this.value = ''

    // Fonts
    if (!this.fontFallback) {
      this.fontFallback = 'sans-serif'
    }
    if (!this.fontWeight) {
      this.fontWeight = 400
    }
    if (!this.fontSize) {
      this.fontSize = '18px'
    }
    if (!this.labelFontSize) {
      this.labelFontSize = '16px'
    }

    // Texts
    if (!this.label) {
      this.label = 'Label'
    }

    // Type
    if (!this.type) {
      this.type = 'text'
    }

    // Colors
    if (!this.backgroundColor) {
      this.backgroundColor = 'transparent'
    }
    if (!this.labelColor) {
      this.labelColor = 'rgba(0, 0, 0, 0.5)'
    }
    if (!this.inputColor) {
      this.inputColor = '#000000'
    }
    if (!this.underlineColor) {
      this.underlineColor = 'rgba(0, 0, 0, 0.75)'
    }
  }
  updateParams(name, newVal) {
    switch(name) {
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
      case 'font-size':
        this.fontSize = newVal
        break
      case 'label-font-size':
        this.labelFontSize = newVal
        break

      // Texts
      case 'label':
        this.label = newVal
        break

      // Type
      case 'type':
        this.type = newVal
        break

      // Colors
      case 'background-color':
        this.backgroundColor = newVal
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
    }
  }
  render() {
    // Fonts
    if (this.fontGoogle) {
      this.rootElem.style.setProperty('--font-family', `'${this.fontGoogle}', ${this.fontFallback}`)
    } else {
      this.rootElem.style.setProperty('--font-family', this.fontFallback)
    }
    this.rootElem.style.setProperty('--font-weight', this.fontWeight)
    this.rootElem.style.setProperty('--font-size', this.fontSize)
    this.rootElem.style.setProperty('--label-font-size', this.labelFontSize)
    this.rootElem.style.setProperty('--padding-top', `${Number(this.labelFontSize.replace('px', '')) * 1}px`)

    // Texts
    this.labelElem.textContent = this.label

    // Type
    this.inputElem.setAttribute('type', this.type)

    // Colors
    this.rootElem.style.setProperty('--background-color', this.backgroundColor)
    this.rootElem.style.setProperty('--label-color', this.labelColor)
    this.rootElem.style.setProperty('--input-color', this.inputColor)
    this.rootElem.style.setProperty('--underline-color', this.underlineColor)
  }
}

window.customElements.define('labeled-input', LabeledInput)
