import React, { Component } from "react";
import { Route } from "react-router-dom";
import CharacterForm from "./characters/CharacterForm";
import QuestViews from "./quest/QuestViews";

export default class ApplicationViews extends Component {
  render() {
    return (
      <>
        {/* <Route exact path="/" render={props => <Quests />} /> */}
        <Route path="/quests" render={props => <QuestViews {...props} />} />
        {/* 
        <Route
          path="/quests/:questId(\d+)"
          render={props => (
            <Quests questId={parseInt(props.match.params.questId)} {...props} />
          )}
        />

        <Route path="/quests/new" render={props => <Quests {...props} />} /> */}

        <Route
          path="/character/new"
          render={props => <CharacterForm {...props} />}
        />
        {/* <Route path="/guild" render={props => <Guild />} /> */}
      </>
    );
  }
}
