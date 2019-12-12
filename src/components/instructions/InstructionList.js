import React, { Component } from "react";
import { ListGroup, Form } from "react-bootstrap";
import APIManager from "../modules/APIManager";

export default class InstructionList extends Component {
  state = {
    instructions: [],
    loadingStatus: true
  };

  completeInstruction = async id => {
    this.setState({ loadingStatus: true });
    await APIManager.patch(`instructions`, {
      id: id,
      isComplete: true
    });
    await this.getOrderedSteps();
  };
  async getOrderedSteps() {
    const steps = await APIManager.get(
      `instructions?questId=${this.props.questId}&_expand=step`
    );
    const orderedSteps = [steps.find(step => step.isFirstStep)];

    for (
      let i = 1, nextStep = orderedSteps[i - 1].nextInstructionId;
      i < steps.length && nextStep !== null;
      nextStep = orderedSteps[i].nextInstructionId, i++
    ) {
      orderedSteps.push(steps.find(step => nextStep === step.id));
    }
    this.setState({ instructions: orderedSteps, loadingStatus: false });
  }
  async componentDidMount() {
    await this.getOrderedSteps();
  }
  render() {
    return (
      <>
        <h5>Steps:</h5>
        <ListGroup>
          {this.state.instructions.map(instruction => (
            <ListGroup.Item key={instruction.id}>
              <Form.Check
                type="checkbox"
                disabled={instruction.isComplete}
                defaultChecked={instruction.isComplete}
                inline
                onChange={() => {
                  this.completeInstruction(instruction.id);
                }}
              />
              {instruction.step.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </>
    );
  }
}
