import keycode from 'keycode';
import React from 'react';

export default class TodoTextInput extends React.Component {
  static propTypes = {
    commitOnBlur: React.PropTypes.bool.isRequired,
    initialValue: React.PropTypes.string,
    onCancel: React.PropTypes.func,
    onDelete: React.PropTypes.func,
    onSave: React.PropTypes.func.isRequired,
  };

  static defaultProps = {
    commitOnBlur: false,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      isEditing: false,
      text: this.props.initialValue || '',
    };
  }

  onKeyDown = (e) => {
    if (this.props.onCancel && e.keyCode === keycode.codes.esc) {
      this.props.onCancel();
    } else if (e.keyCode === keycode.codes.enter) {
      this.commitChanges();
    }
  };

  onChange = (e) => {
    this.setState({ text: e.target.value });
  };

  onBlur = () => {
    if (this.props.commitOnBlur) {
      this.commitChanges();
    }
  };

  commitChanges() {
    const newText = this.state.text.trim();
    if (this.props.onDelete && !newText) {
      this.props.onDelete();
    } else if (this.props.onCancel && newText === this.props.initialValue) {
      this.props.onCancel();
    } else if (newText) {
      this.props.onSave(newText);
      this.setState({ text: '' });
    }
  }

  render() {
    return (
      <input
        {...this.props}
        onKeyDown={this.onKeyDown}
        onChange={this.onChange}
        onBlur={this.onBlur}
        value={this.state.text}
      />
    );
  }
}
