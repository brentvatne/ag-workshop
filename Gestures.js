import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { GestureHandler } from 'expo';
const {
  RotationGestureHandler,
  PanGestureHandler,
  PinchGestureHandler,
  State,
} = GestureHandler;

export default class Gestures extends React.Component {
  panX = new Animated.Value(0);
  scale = new Animated.Value(1);
  rotation = new Animated.Value(0);
  baseScale = new Animated.Value(1);
  _lastScale = 1;

  render() {
    const { panX, scale, baseScale, rotation } = this;
    let actualScale = Animated.multiply(scale, baseScale);

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <RotationGestureHandler
          id="rotate"
          onGestureEvent={Animated.event([{ nativeEvent: { rotation } }])}
          onHandlerStateChange={this._handleRotationGestureStateChange}>
          <PinchGestureHandler
            id="pinch"
            simultaneousHandlers={['rotate']}
            onGestureEvent={Animated.event([{ nativeEvent: { scale } }])}
            onHandlerStateChange={this._handlePinchGestureStateChange}>
            <PanGestureHandler
              simultaneousHandlers={['pinch', 'rotate']}
              onGestureEvent={Animated.event([
                { nativeEvent: { translationX: panX } },
              ])}
              onHandlerStateChange={this._handlePanGestureStateChange}>
              <Animated.View
                style={[
                  styles.box,
                  {
                    transform: [
                      { scale: actualScale },
                      { translateX: panX },
                      { rotate: rotation },
                    ],
                  },
                ]}
              />
            </PanGestureHandler>
          </PinchGestureHandler>
        </RotationGestureHandler>
      </View>
    );
  }

  _handlePinchGestureStateChange = e => {
    const { oldState, scale, state } = e.nativeEvent;
    console.log({ oldState, state });

    if (oldState === State.ACTIVE) {
      this._lastScale = this._lastScale * scale;
      this.baseScale.setValue(this._lastScale);
      this.scale.setValue(1);
      // this.scale.extractOffset();
    }
  };

  _handleRotationGestureStateChange = e => {
    const { oldState } = e.nativeEvent;

    if (oldState === State.ACTIVE) {
      this.rotation.extractOffset();
    }
  }

  _handlePanGestureStateChange = e => {
    // console.log(e.nativeEvent);
    const { oldState } = e.nativeEvent;

    if (oldState === State.ACTIVE) {
      // This adds the value to the current offset, then sets the value to 0
      this.panX.extractOffset();

      if (true /* some condition based on gesture values*/) {
        // do something
      } else {
        // do something else
      }
    }
  };
}

const styles = StyleSheet.create({
  box: {
    width: 80,
    height: 80,
    backgroundColor: 'red',
  },
});
