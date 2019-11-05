import React, { Component } from "react";
import RecordLabelList from "./RecordLabelList";
import RecordLabelService from "../services/record_label_service";

class App extends Component {
  state = {
    recordLabels: [],
    error: null
  };
  async componentDidMount() {
    const { recordLabels, error } = await RecordLabelService.getRecordLabels();
    if (error) {
      this.setState({ error });
    } else {
      this.setState({ recordLabels, error: null });
    }
  }
  render() {
    const { recordLabels, error } = this.state;
    return <RecordLabelList recordLabels={recordLabels} error={error}></RecordLabelList>;
  }
}

export default App;
