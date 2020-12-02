import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { PanelOptions, Frame } from 'types';
import { processData } from './util/helpFuc';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import GoIcon from './img/go-icon.png';
import StopIcon from './img/stop-icon.png';
import 'react-circular-progressbar/dist/styles.css';

interface Props extends PanelProps<PanelOptions> {}
interface State {
  num: number;
}

export class MainPanel extends PureComponent<Props, State> {
  state: State = {
    num: 0,
  };

  componentDidMount() {
    const series = this.props.data.series as Frame[];
    if (series.length == 0 || series[0].fields[0].values.buffer.length == 0) {
      return;
    }

    const buffer = series[0].fields[0].values.buffer;
    const num = processData(buffer);
    this.setState({ num });
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.data.series !== this.props.data.series) {
      const series = this.props.data.series as Frame[];
      if (series.length == 0 || series[0].fields[0].values.buffer.length == 0) {
        this.setState({ num: 0 });
        return;
      }

      const buffer = series[0].fields[0].values.buffer;
      const num = processData(buffer);
      this.setState({ num });
    }
  }

  render() {
    const { width, height } = this.props;
    const { num } = this.state;

    return (
      <div
        style={{
          width,
          height,
          padding: 30,
        }}
      >
        <CircularProgressbarWithChildren value={num >= 1040 ? 1040 : (num / 1040) * 100}>
          {num < 1040 ? (
            <img style={{ width: width / 2.2 }} src={GoIcon} />
          ) : (
            <img style={{ width: width / 2.2 }} src={StopIcon} />
          )}
        </CircularProgressbarWithChildren>
      </div>
    );
  }
}
