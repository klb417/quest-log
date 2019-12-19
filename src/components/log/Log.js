import React, { Component } from "react";
import { Card, Accordion, ListGroup } from "react-bootstrap";
import "./Log.css";

export default class Log extends Component {
  state = {
    loadingStatus: true
  };
  componentDidMount() {
    this.setState({
      loadingStatus: false
    });
  }
  render() {
    console.log("log state", this.state);
    console.log("log props", this.props);
    return (
      <Card className="log-display">
        <Card.Header>Quest Log</Card.Header>
        <Card.Body className="log-body">
          <Accordion defaultActiveKey="0">
            <Accordion.Toggle
              className="accordion-header"
              as={Card.Header}
              variant="link"
              eventKey="0">
              <Card.Text className="accordion-title">Quests</Card.Text>
              <Card.Text className="accordion-quest-count">
                {
                  this.props.quests.filter(
                    quest => !quest.isComplete && quest.recurInDays === 0
                  ).length
                }
              </Card.Text>
            </Accordion.Toggle>
            <Accordion.Collapse className="log-body" eventKey="0">
              <ListGroup>
                {/* {this.props.quests.length === 0 ? ( */}
                {this.props.quests
                  .filter(quest => !quest.isComplete && quest.recurInDays === 0)
                  .map(
                    quest => (
                      <ListGroup.Item
                        className="log-item"
                        as={Card.Header}
                        key={quest.id}
                        onClick={() => {
                          this.props.history.push(`/quests/${quest.id}`);
                        }}>
                        {quest.name}
                      </ListGroup.Item>
                    )
                    /* ) : (
                  <ListGroup.Item variant="warning">
                    You are not on a quest!
                  </ListGroup.Item> */
                  )}
              </ListGroup>
            </Accordion.Collapse>
            <Accordion.Toggle
              className="accordion-header"
              as={Card.Header}
              variant="link"
              eventKey="3">
              <Card.Text className="accordion-title">Complete</Card.Text>
              <Card.Text className="accordion-quest-count">
                {this.props.quests.filter(quest => quest.isComplete).length}
              </Card.Text>
            </Accordion.Toggle>
            <Accordion.Collapse className="log-body" eventKey="3">
              <ListGroup>
                {this.props.quests
                  .filter(quest => quest.isComplete)
                  .map(quest => (
                    <ListGroup.Item
                      className="log-item text-muted"
                      as={Card.Header}
                      key={quest.id}
                      onClick={() => {
                        this.props.history.push(`/quests/${quest.id}`);
                      }}>
                      {quest.name}
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            </Accordion.Collapse>
          </Accordion>
        </Card.Body>
      </Card>
    );
  }
}
