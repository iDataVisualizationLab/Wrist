import React, {Component} from 'react';
import * as d3 from 'd3';
import {scaleLinear} from 'd3-scale';
import {withStyles} from "@material-ui/core/styles";
import {axis,axisAngle} from "./parameter";

const styles = theme => ({
});

class WristChart extends React.Component {
    constructor(props) {
        super(props);
        this.svg = React.createRef();
        this.state = {
            margin: {top: 10, right: 10, bottom: 10, left: 10},
            width: 400,
            height: 100,
            data:[],
            widthG: function () {
                return this.width - this.margin.left - this.margin.right
            },
            heightG: function () {
                return this.height - this.margin.top - this.margin.bottom
            },
            fontSize:12,
            LineFunc: d3.line()
                // .interpolate("linear-closed")
                .curve(d3.curveCardinal.tension(0.7))
                .x((d,i) => {
                    return this.xScale(i);
                })
                .y( (d, i) => {
                    return this.yScale(d.mean);
                }),
            rScale: d3.scaleLinear(),
            radarLine: d3.radialLine()
                // .interpolate("linear-closed")
                .curve(d3.curveCardinalClosed.tension(0.7))
                .radius((d) => {
                    return this.state.rScale(d);
                })
                .angle(function (d, i) {
                    return axisAngle(i);
                }),
        };
        this.xScale = scaleLinear();
        this.yScale = scaleLinear();
        this.state.colorLevels = scaleLinear().domain([0,0.25,0.5,0.75,1]).range(['#d7191c', '#fdae61', '#ffffbf', '#a6d96a', '#1a9641']);
        axis.forEach(a => a.scale = d3.scaleLinear().domain(a.range));
    }
    componentDidMount() {
        this.state.rScale.range([0, 30]);
        this.xScale.range([0, this.state.widthG()]);
        this.yScale.range([this.state.heightG(),0]);
        const data = (this.props.data ?? []).map(d => {
            const ob = axis.map(a => a.scale(((typeof (d[a.id]) === 'object') && d[a.id]) ? d[a.id].result : d[a.id]));
            if (this.props.keyColor)
                ob[this.props.keyColor] = d[this.props.keyColor];
            ob.mean = d3.mean(ob);
            return ob;
        });
        this.xScale.domain([0,data.length-1]);
        this.setState({data});
    }
    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            const data = (this.props.data ?? []).map(d => {
                const ob = axis.map(a => a.scale(((typeof (d[a.id]) === 'object') && d[a.id]) ? d[a.id].result : d[a.id]));
                if (this.props.keyColor)
                    ob[this.props.keyColor] = d[this.props.keyColor];
                ob.mean = d3.mean(ob);
                return ob
            });
            this.xScale.domain([0,data.length-1]);
            this.setState({data});
        }
    }
    render() {
        const {classes} = this.props;
        // this.adjustFont();
        return (
            <div style={{position: 'relative', overflow: "visible"}}>
                <svg viewBox={"0 0 " + this.state.width + ' ' + this.state.height}
                     preserveAspectRatio="xMidYMid meet"
                     ref={this.svg}
                     style={{overflow: "visible"}}
                     id={this.props.id}>
                    <g className={"content"}
                       fontFamily={"sans-serif"}
                       fontSize={this.state.fontSize}
                       transform={`translate(${[this.state.margin.left, this.state.margin.top]})`}>
                        <g className={"axisHolder"} fill={"none"}>
                            <rect width={this.state.widthG()} height={this.state.heightG()} fill={'#ddd'}/>
                        </g>
                        <g className={"Line"}
                           fill={"none"} strokeOpacity={1} strokeWidth={0.5}>
                            <path d={this.state.LineFunc(this.state.data)}
                                  stroke='black'/>
                        </g>
                        <g className={"Dots"}>
                            {this.state.data.map((d, i) => <path d={this.state.radarLine(d)}
                                                                 transform={`translate(${this.xScale(i)},${this.yScale(d.mean)})`}
                                                                 // strokeOpacity={this.props.selectedIndex === undefined ? 1 : (this.props.selectedIndex === (this.props.keyColor ? d[this.props.keyColor] : i) ? 1 : 0.1)}
                                                                 fill={this.state.colorLevels(d.mean)}
                                                                 fillOpacity={0.8}
                                                                 // stroke={this.state.colorLevels(d.mean)}
                                                                 stroke={'black'}
                                                                 strokeWidth={0.5}
                            />)}
                            {this.state.data.map((d, i) =><circle cx={this.xScale(i)}
                                                                  cy={this.yScale(d.mean)}
                                                                  r={2}
                                                                  fill={'black'}/>)}
                        </g>
                    </g>
                </svg>
            </div>
        );
    }
}

export default withStyles(styles)(WristChart);
