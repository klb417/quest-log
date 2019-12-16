import React, { Component } from "react";
import { Card, Button, Form, ButtonGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import ActionBar from "../actionbar/ActionBar";
import DayPicker from "react-day-picker";
import APIManager from "../modules/APIManager";
import InstructionEditForm from "../instructions/InstructionEditForm";

export default class QuestEditForm extends Component {
  state = {
    creatorId: "",
    name: "",
    difficultyId: "",
    difficulties: [],
    description: "",
    isStepsHidden: false,
    creationDate: "",
    completionDate: "",
    recurInDays: "",
    rewards: "",
    isComplete: false,
    parentQuestId: null,
    instructions: [],
    assignees: [],
    loadingStatus: true
  };
  handleFieldChange = evt => {
    const stateToChange = {};
    stateToChange[evt.target.id] = evt.target.value;
    this.setState(stateToChange);
  };
  addInstruction = step => {
    this.state.instructions.length === 0
      ? this.state.instructions.push({
          ...step,
          isFirstStep: true,
          isComplete: false
        })
      : this.state.instructions.push({
          ...step,
          isFirstStep: false,
          isComplete: false
        });
  };
  removeInstruction = id => {
    if (this.state.instructions[id].isFirstStep) {
      const instructions = this.state.instructions.filter(
        (step, index) => id !== index
      );
      instructions[0].isFirstStep = true;
      this.setState({ instructions: instructions });
    } else {
      this.setState({
        instructions: this.state.instructions.filter(
          (step, index) => id !== index
        )
      });
    }
  };
  setInstructions = editedInstructions => {
    this.setState({ instructions: editedInstructions });
  };
  handleEditSaveForm = async () => {
    if (
      !this.state.instructions[0] ||
      !this.state.name ||
      !this.state.description
    ) {
      window.alert("Please fill out all fields");
    } else {
      const editedQuestDetails = {
        id: this.props.questId,
        creatorId: this.state.creatorId,
        name: this.state.name,
        difficultyId: this.state.difficultyId,
        description: this.state.description,
        isStepsHidden: this.state.isStepsHidden,
        creationDate: this.state.creationDate,
        completionDate: new Date(this.state.completionDate)
          .toISOString()
          .split("T")[0],
        recurInDays: this.state.recurInDays,
        rewards: this.state.rewards,
        isComplete: this.state.isComplete,
        parentQuestId: this.state.parentQuestId
      };
      const editedQuest = await APIManager.update("quests", editedQuestDetails);
      if (editedQuest) {
        const oldInstructions = await APIManager.get(
          `instructions?questId=${this.props.questId}`
        );
        oldInstructions.forEach(
          async instruction =>
            await APIManager.delete(`instructions/${instruction.id}`)
        );
        console.log("oldInstructions", oldInstructions);
        for (
          let i = this.state.instructions.length - 1, nextId = null;
          i >= 0;
          i--
        ) {
          console.log("i", i);
          const instructionResponse = await APIManager.post("instructions", {
            questId: editedQuest.id,
            stepId: this.state.instructions[i].id,
            isFirstStep: this.state.instructions[i].isFirstStep,
            nextInstructionId: nextId,
            isComplete: this.state.instructions[i].isComplete
          });
          nextId = instructionResponse.id;
        }
        await this.props.setUpdatedQuests();

        this.props.history.push(`/quests/${this.props.questId}`);
      } else {
        window.alert("Something went wrong");
      }
    }
  };
  async componentDidMount() {
    const quest = await APIManager.get(`quests/${this.props.questId}`);
    const difficulties = await APIManager.get("difficulties");

    const steps = await APIManager.get("steps");
    this.setState({
      ...quest,
      difficulties: difficulties,
      steps: steps,
      loadingStatus: false
    });
  }
  render() {
    console.log("questEditForm state", this.state);
    console.log("questEditForm props", this.props);
    return (
      <>
        <Card className="quest-form-container">
          <Card.Header>
            <span>
              <Link to={"/quests"}>
                <Button>{"<"}</Button>
              </Link>
            </span>
            Quest Edit
          </Card.Header>
          <Card.Body className="quest-form-body">
            <Form>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  id="name"
                  placeholder="Slay the dragon!"
                  defaultValue={this.state.name}
                  onChange={this.handleFieldChange}
                />
                <Form.Text className="text-muted">
                  What will the quest name be?
                </Form.Text>
              </Form.Group>
              <hr />
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  id="description"
                  defaultValue={this.state.description}
                  onChange={this.handleFieldChange}
                  placeholder="Here's what's happening. . ."
                />
                <Form.Text className="text-muted">What's going down?</Form.Text>
              </Form.Group>
              <hr />
              <Form.Group>
                <InstructionEditForm
                  questId={this.props.questId}
                  instructions={this.state.instructions}
                  setInstructions={this.setInstructions}
                  addInstruction={this.addInstruction}
                  removeInstruction={this.removeInstruction}
                />
                <Form.Check
                  disabled={this.state.loadingStatus}
                  inline
                  name="isStepsHidden"
                  id="isStepsHidden"
                  type="checkbox"
                  checked={this.state.isStepsHidden}
                  onChange={this.handleCheckBox}
                />
                <Form.Label>Hide next steps</Form.Label>
              </Form.Group>
              <hr />
              <Form.Group className="d-flex flex-column">
                <Form.Label>Difficulty</Form.Label>
                <ButtonGroup>
                  {this.state.difficulties.map(difficulty => (
                    <Button
                      type="button"
                      key={difficulty.id}
                      id="difficultyId"
                      onClick={() => {
                        this.setState({
                          difficultyId: difficulty.id
                        });
                      }}>
                      {difficulty.type}
                    </Button>
                  ))}
                </ButtonGroup>
              </Form.Group>
              <hr />
              <Form.Group>
                <Form.Label>Repeat</Form.Label>
                <Form.Check
                  inline
                  name="recurInDays"
                  id="1"
                  type="radio"
                  label="never"
                  value="0"
                  defaultChecked
                  onClick={() => this.setState({ recurInDays: 0 })}
                />
                <Form.Check
                  inline
                  name="recurInDays"
                  id="2"
                  type="radio"
                  label="daily"
                  value="1"
                  onClick={() => this.setState({ recurInDays: 1 })}
                />
                <Form.Check
                  inline
                  name="recurInDays"
                  id="3"
                  type="radio"
                  label="weekly"
                  value="7"
                  onClick={() => this.setState({ recurInDays: 7 })}
                />
                <Form.Text className="text-muted">
                  Does this quest need to occur each day or once a week?
                </Form.Text>
              </Form.Group>
              <hr />
              <Form.Group>
                {/* <Form.Label>Finish by</Form.Label> */}
                <DayPicker
                  selectedDays={new Date(this.state.completionDate)}
                  id="completionDate"
                  onDayClick={this.handleDayPickerClick}
                />
                <Form.Text className="text-muted">
                  When does this need to be finished?
                </Form.Text>
              </Form.Group>
              <hr />
              <Form.Group>
                <Form.Label>Rewards</Form.Label>
                <Form.Control
                  type="text"
                  id="rewards"
                  defaultValue={this.state.rewards}
                  placeholder="The payment for victory. . ."
                  onChange={this.handleFieldChange}
                />
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
        <ActionBar handleEditSaveForm={this.handleEditSaveForm} />
      </>
    );
  }
}