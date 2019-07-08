// @flow
import React from "react";
import type { MeasurementType, MeasurementValue } from "../../../libs/scijs";
import { MeasurementTypes } from "../../../libs/scijs";
import MemoView from "./MemoView";
import GenericScaleView from "./GenericScaleView"
export default class MeasurementScaleViewFactory {

  static createView(
      type: MeasurementType,
      selectedScaleValue: MeasurementValue,
      updateSelectedScaleValue: (type: MeasurementType, value: MeasurementValue) => void
    ): any {
    let view;
      let minValueDesc = "Best possible";
      let maxValueDesc = "Worst possible";
      let useGenericView = true;

      switch(type) {
        case MeasurementTypes.muscleTightness:
          minValueDesc = "No muscle tightness";
          maxValueDesc = "Worst possible tightness";
          break;
        case MeasurementTypes.sleepQuality: 
          minValueDesc="Best possible sleep quality";
          maxValueDesc="Worst possible sleep quality";
          break;
        case MeasurementTypes.spasticitySeverity: 
          minValueDesc = "No pain";
          maxValueDesc = "Worst possible pain";
          break;
        case MeasurementTypes.tiredness:
          minValueDesc = "Very energetic";
          maxValueDesc = "Worst possible tiredness";
          break;
        case MeasurementTypes.weakness:
          minValueDesc = "No feeling of weakness";
          maxValueDesc = "Worst possible weakness";
          break;
        case MeasurementTypes.sleepiness:
          minValueDesc = "No feeling of sleepiness";
          maxValueDesc = "Very sleepy";
          break;
        case MeasurementTypes.dizziness:
          minValueDesc = "No feeling of dizziness";
          maxValueDesc = "Worst possible dizziness";
          break;
        case MeasurementTypes.respiratoryMovement:
          minValueDesc = "No respiratory problem";
          maxValueDesc = "Worst possible respiratory problem";
          break;
        case MeasurementTypes.memo:
          view = <MemoView 
            type={type}
            selectedScaleValue={selectedScaleValue}
            updateSelectedScaleValue={updateSelectedScaleValue}
          />
          useGenericView = false;
          break;
        case MeasurementTypes.mood:
          minValueDesc = "Very good mood";
          maxValueDesc = "Very bad mood";
          break;
        default: 
          break;
      }

      if(useGenericView) {
        view = <GenericScaleView
        type={type}
        title={type}
        minValue={0}
        maxValue={5}
        minValueDesc={minValueDesc}
        maxValueDesc={maxValueDesc}
        selectedScaleValue={selectedScaleValue}
        updateSelectedScaleValue={updateSelectedScaleValue}
        isDailyEval={false}
      />
      }
      
      return view;
  }
}