/**
 * SwitchProperty
 *
 * A bubble showing a switch.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const BaseProperty = require('./base-property');

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: inline-block;
      contain: content;
      text-align: center;
      color: white;
      font-size: 1.6rem;
    }

    .webthing-switch-property-container {
      width: 10rem;
      height: 10rem;
      border-radius: 5rem;
      border: 2px solid white;
      background-color: #88b6d6;
      position: relative;
    }

    .webthing-switch-property-contents {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .webthing-switch-property-switch {
      display: none;
    }

    .webthing-switch-property-slider {
      display: block;
      width: 5.5rem;
      height: 2.2rem;
      border-radius: 1.1rem;
      background-color: #5d9bc7;
      cursor: pointer;
      transition: 0.1s;
    }

    .webthing-switch-property-slider::after {
      content: "";
      display: block;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      background-color: white;
      transform: translate(0.35rem, 0.35rem);
      transition: 0.1s;
    }

    .webthing-switch-property-switch:checked + #slider::after {
      transform: translate(3.65rem, 0.35rem);
    }

    .webthing-switch-property-label {
      padding-top: 0.5rem;
      text-transform: uppercase;
      font-weight: bold;
    }

    .webthing-switch-property-name {
      text-align: center;
      max-width: 10rem;
      overflow-wrap: break-word;
      background-color: #5d9bc7;
      display: inline-block;
    }
  </style>
  <div id="container" class="webthing-switch-property-container">
    <div id="contents" class="webthing-switch-property-contents">
      <form>
        <input type="checkbox" id="switch"
          class="webthing-switch-property-switch">
        <label id="slider" for="switch" class="webthing-switch-property-slider">
        </label>
      </form>
      <div id="label" class="webthing-switch-property-label"></div>
    </div>
  </div>
  <div id="name" class="webthing-switch-property-name"></div>
`;

class SwitchProperty extends BaseProperty {
  constructor() {
    super(template);

    this._input = this.shadowRoot.querySelector('#switch');
    this._name = this.shadowRoot.querySelector('#name');
    this._label = this.shadowRoot.querySelector('#label');

    this._onClick = this.__onClick.bind(this);
    this._onKeyUp = this.__onKeyUp.bind(this);
  }

  connectedCallback() {
    this.name = this.dataset.name;
    this.label = this.dataset.offLabel;

    this._upgradeProperty('checked');
    this._upgradeProperty('disabled');

    this._input.addEventListener('click', this._onClick);
    this._input.addEventListener('keyup', this._onKeyUp);
  }

  disconnectedCallback() {
    this._input.removeEventListener('click', this._onClick);
    this._input.removeEventListener('keyup', this._onKeyUp);
  }

  get checked() {
    return this._input.hasAttribute('checked');
  }

  set checked(value) {
    const isChecked = Boolean(value);
    if (isChecked) {
      this._input.setAttribute('checked', '');
    } else {
      this._input.removeAttribute('checked');
    }

    this._input.checked = isChecked;
    this._label.innerText = isChecked ? this.onLabel : this.offLabel;
  }

  get disabled() {
    return this._input.hasAttribute('disabled');
  }

  set disabled(value) {
    const isDisabled = Boolean(value);
    if (isDisabled) {
      this._input.setAttribute('disabled', '');
    } else {
      this._input.removeAttribute('disabled');
    }

    this._input.disabled = isDisabled;
  }

  get value() {
    return this.checked;
  }

  set value(value) {
    this.checked = value;
  }

  get name() {
    return this._name.innerText;
  }

  set name(value) {
    this._name.innerText = value;
  }

  get label() {
    return this._label.innerText;
  }

  set label(value) {
    this._label.innerText = value;
  }

  get onLabel() {
    return this.dataset.onLabel;
  }

  set onLabel(label) {
    this.dataset.onLabel = label;
  }

  get offLabel() {
    return this.dataset.offLabel;
  }

  set offLabel(label) {
    this.dataset.offLabel = label;
  }

  __onKeyUp(e) {
    if (e.altKey) {
      return;
    }

    if (e.keyCode === 32) {
      e.preventDefault();
      this._toggleChecked();
    }
  }

  __onClick() {
    this._toggleChecked();
  }

  _toggleChecked() {
    if (this.disabled) {
      return;
    }

    this.checked = !this.checked;
    this.dispatchEvent(new CustomEvent('change', {
      detail: {
        checked: this.checked,
      },
      bubbles: true,
    }));
  }
}

window.customElements.define('webthing-switch-property', SwitchProperty);
module.exports = SwitchProperty;
