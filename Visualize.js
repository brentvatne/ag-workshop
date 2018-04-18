import React from 'react';
import {
  Animated,
  StatusBar,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { VictoryChart, VictoryLine, VictoryTheme } from 'victory-native';
import clamp from 'clamp';

const Button = ({ onPress, title }) => (
  <TouchableOpacity onPress={onPress} style={{ paddingTop: 5 }}>
    <Text style={{ fontSize: 14, color: '#888' }}>{title}</Text>
  </TouchableOpacity>
);

console.disableYellowBox = true;

export default class App extends React.Component {
  progress = new Animated.Value(0);
  state = {
    showFrames: false,
    values: [{ x: 0, y: 0 }],
  };

  _showFrames = () => {
    this.setState({ showFrames: true });
  };

  _hideFrames = () => {
    this.setState({ showFrames: false });
  };

  componentDidMount() {
    this.progress.addListener(({ value }) => {
      let values = [...this.state.values];
      values.push({ x: values.length, y: value });
      this.setState({ values });
    });
  }

  renderFrames = () => {
    return this.state.values.map(({ x, y }) => (
      <View
        style={[
          styles.box,
          {
            opacity: 0.1,
            backgroundColor: 'maroon',
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: 'white',
            transform: [{ translateX: y * 500 }],
          },
        ]}
      />
    ));
  };

  render() {
    let translateX = this.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 500],
    });
    let { x, y } = this.state.values[this.state.values.length - 1];

    return (
      <View style={styles.container}>
        <View style={{ flex: 1, height: 70 }}>
          {this.state.showFrames ? (
            this.renderFrames()
          ) : (
            <Animated.View
              style={[
                { backgroundColor: 'maroon', transform: [{ translateX }] },
                styles.box,
              ]}
            />
          )}
        </View>
        <View style={{ flex: 3, flexDirection: 'row' }}>
          <View style={{ flex: 1, marginTop: -40 }}>
            <VictoryChart
              theme={VictoryTheme.material}
              width={300}
              height={275}>
              <VictoryLine
                style={{
                  data: { stroke: '#c43a31' },
                  parent: { border: '1px solid #ccc' },
                }}
                domain={{ x: [0, 70], y: [0, 1.5] }}
                data={this.state.values}
              />
            </VictoryChart>
          </View>
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Value: {y.toFixed(2)}</Text>
            <Text>Frame: {x}</Text>
            <Button title="Linear" onPress={this._linearAnimation} />
            <Button
              title="Ease in out quad"
              onPress={this._inOutQuadAnimation}
            />
            <Button
              title="Ease in bounce"
              onPress={this._inBounceAnimation}
            />
            <Button title="Spring" onPress={this._springAnimation} />
            <Button
              title="Bouncey spring"
              onPress={this._bounceySpringAnimation}
            />
            {this.state.showFrames ? (
              <Button title="Hide frames" onPress={this._hideFrames} />
            ) : (
              <Button title="Show frames" onPress={this._showFrames} />
            )}
          </View>
        </View>
        <StatusBar hidden />
      </View>
    );
  }

  _resetState = () => {
    return new Promise(resolve => {
      this.progress.setValue(0);
      this.setState({ values: [{ x: 0, y: 0 }] }, resolve);
    });
  };

  _linearAnimation = async () => {
    await this._resetState();
    Animated.timing(this.progress, {
      toValue: 1,
      easing: Easing.linear,
      duration: 1000,
    }).start();
  };

  _inOutQuadAnimation = async () => {
    await this._resetState();
    Animated.timing(this.progress, {
      toValue: 1,
      easing: Easing.inOut(Easing.quad),
      duration: 1000,
    }).start();
  };

  _inBounceAnimation = async () => {
    await this._resetState();
    Animated.timing(this.progress, {
      toValue: 1,
      easing: Easing.in(Easing.bounce),
      duration: 1000,
    }).start();
  }

  _springAnimation = async () => {
    await this._resetState();
    Animated.spring(this.progress, {
      toValue: 1,
    }).start();
  };

  _bounceySpringAnimation = async () => {
    await this._resetState();
    Animated.spring(this.progress, {
      toValue: 1,
      bounciness: 20,
    }).start();
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  box: {
    width: 50,
    height: 50,
    top: 10,
    left: 10,
    position: 'absolute',
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
