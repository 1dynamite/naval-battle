import React from "react";

let intervalId: ReturnType<typeof setInterval>;

export default class StatusMessage extends React.Component<
  { message: { message: string } },
  { index: number }
> {
  constructor(props: { message: { message: string } }) {
    super(props);

    this.state = {
      index: 0,
    };
  }

  componentWillUnmount() {
    clearInterval(intervalId);
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.message !== prevProps.message) {
      this.setState({ index: 0 });
      intervalId = setInterval(() => {
        this.setState((state) => {
          if (state.index === this.props.message.message.length)
            clearInterval(intervalId);

          return { index: state.index + 1 };
        });
      }, 150);
    }
  }

  render() {
    return (
      <div>
        {this.props.message.message.split("").map((letter, index) => (
          <span
            key={index}
            style={{ marginRight: "3px" }}
            className={
              this.state.index > index
                ? "status-message-letter"
                : "opacity-zero"
            }
          >
            {letter}
          </span>
        ))}
      </div>
    );
  }
}
