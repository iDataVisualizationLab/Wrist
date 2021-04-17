import React, {Component} from 'react';
import * as d3 from 'd3';
import {scaleOrdinal} from 'd3-scale';
import {withStyles} from "@material-ui/core/styles";
import Text from "./Text";

const styles = theme => ({
    menu: {
        marginLeft: '5px',
        marginRight: '5px',
        display: 'flex',
        position: "absolute",
        width: '100%',
        top: '10px',
        left: 0,
    },
    axis: {
        transformOrigin: '0,0'
    }
});

const axis = [
    {id: 'PSFS score', label: 'PSFS (0-10 / Poor=0 ; Good=10)', range: [0, 10]},
    {id: 'PRWE Pain Scale', label: 'PRWE Pain Scale (0-50 0= no pain, 10= worst pain ever)', range: [50, 0]},
    {
        id: 'PRWE Function subscale',
        label: 'PRWE Function subscale (0-50 / 0= no difficulty, 10= unable to do)',
        range: [50, 0]
    },
    {id: 'SANE score', label: 'SANE  rate injured body part on a scale of 0-100?/ 100= normal', range: [0, 100]},
    {
        id: 'MHQ score',
        label: 'MHQ work module (1-100 / 1=always, 2=often, 3=sometimes, 4=rarely, 5=never)',
        range: [1, 100]
    },
    {
        id: 'TAM EX-0-Flex',
        label: 'Wrist range motion Flexion/Extension (0= no ROM- 100% equal or better than contra-lateral  wrist )',
        range: [0, 1]
    },
    {
        id: 'TAM Pro-0-Sup',
        label: 'Wrist range motion Pronation/Supination  (0= no ROM- 100% equal or better than contra-lateral wrist )',
        range: [0, 1]
    },
    {
        id: 'TAM Rad-0-Ulnar',
        label: 'Wrist range motion Radial / Ulnar Deviation (0= no ROM- 100% equal or better than contra-lateral wrist )',
        range: [0, 1]
    },
    {
        id: 'Mean of 3 Trials',
        label: 'Grip Strength Ratio  (0= no  grip strength - 100% equal or better than  contra-lateral wrist )',
        range: [0, 1]
    },
    {
        id: 'Grip Strength Supination Ratio',
        label: 'Grip Strength  Supination Ratio (0= no  grip strength - 100% equal or better than  contra-lateral wrist )',
        range: [0, 1]
    },
    {
        id: 'Grip Strength Pronation Ratio',
        label: 'Grip Strength  Pronation Ratio  (0= no  grip strength - 100% equal or better than  contra-lateral wrist )',
        range: [0, 1]
    },
];

const axisAngle = d3.scaleLinear().domain([0, axis.length]).range([0, Math.PI * 2]);


class RadarChart extends React.Component {
    constructor(props) {
        super(props);
        this.svg = React.createRef();
        this.state = {
            // labels: [],
            data: [],
            margin: {top: 200, right: 200, bottom: 200, left: 200},
            width: 800,
            height: 800,
            textWidth: 200,
            widthG: function () {
                return this.width - this.margin.left - this.margin.right
            },
            heightG: function () {
                return this.height - this.margin.top - this.margin.bottom
            },
            radius: function () {
                return Math.min(this.widthG.bind(this)(), this.heightG.bind(this)()) / 2;
            },
            fontSize: 12,
            colors: (props.colors && props.colors.domain) ? props.colors : scaleOrdinal().range(d3.schemeCategory10),
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
            levels: d3.range(1, 6).map(d => d / 5),
            legendW: 80,
            legendH: 30,
        };
        this.state.colorLevels = scaleOrdinal().domain(this.state.levels).range(['#d7191c', '#fdae61', '#ffffbf', '#a6d96a', '#1a9641'])
        axis.forEach(a => a.scale = d3.scaleLinear().domain(a.range));
    }

    componentDidMount() {
        this.state.rScale.range([0, this.state.radius()]);
        const data = (this.props.data ?? []).map(d => {
            const ob = axis.map(a => a.scale(((typeof (d[a.id]) === 'object') && d[a.id]) ? d[a.id].result : d[a.id]));
            if (this.props.keyColor)
                ob[this.props.keyColor] = d[this.props.keyColor]
            return ob;
        });
        console.log(data)
        this.setState({data});
    }

    componentDidUpdate(prevProps) {
        this.state.rScale.range([0, this.state.radius()]);
        if (this.props.data !== prevProps.data) {
            const data = (this.props.data ?? []).map(d => {
                const ob = axis.map(a => a.scale(((typeof (d[a.id]) === 'object') && d[a.id]) ? d[a.id].result : d[a.id]));
                if (this.props.keyColor)
                    ob[this.props.keyColor] = d[this.props.keyColor]
                return ob
            });
            console.log(data)
            this.setState({data});
        }
    }

    onSelect(n) {
        this.props.selected(n.id, this.handleInfo(n));
        this.setState({selected: n});
    }

    handleInfo(n) {
        const data = Object.assign({}, n.data.info);
        data.id = n.data.id;
        return data;
    }

    onMouseOver(n) {
        this.props.onSelect(this.handleInfo(n));
    }

    onMouseLeave() {
        this.props.onSelect(null);
    }

    arcHolder = d3.arc()
        .innerRadius(d => d[0])
        .outerRadius(d => d[1])
        .startAngle(0)
        .endAngle(Math.PI * 2);

    render() {
        const {classes} = this.props;
        // this.adjustFont();
        return (
            <div style={{position: 'relative', overflow: "visible"}}>
                <svg viewBox={"0 0 " + this.state.width + ' ' + this.state.height} ref={this.svg}
                     style={{overflow: "visible"}}
                     id={this.props.id}>
                    <g className={"content"}
                       fontFamily={"sans-serif"}
                       fontSize={this.state.fontSize}
                       transform={`translate(${[this.state.margin.left + this.state.radius(), this.state.margin.top + this.state.radius()]})`}>
                        <g className={"axisHolder"}
                           fill={"none"}>
                            {/*{[...this.state.levels].reverse().map(l=><circle r={this.state.rScale(l)} fill={this.state.colorLevels(l)} stroke={"white"}></circle>)}*/}
                            {this.state.levels.map((l, li) => <path
                                d={this.arcHolder([this.state.rScale(this.state.levels[li - 1] ?? 0), this.state.rScale(l)])}
                                fill={this.state.colorLevels(l)}
                                stroke={'#fff'} strokeOpacity={1} strokeWidth={1}
                                fillOpacity={0.3}></path>)}
                            {axis.map((a, i) => <g className={classes.axis}
                                                   style={{transform: `rotate(${axisAngle(i)}rad)`}}>
                                <line y2={-this.state.rScale(1)} stroke={'#000'} strokeOpacity={0.5}
                                      strokeWidth={0.5}></line>
                            </g>)}
                            {axis.map((a, i) => <Text fill={'#000'} stroke={'unset'} strokeOpacity={0}
                                                      textAnchor="middle"
                                                      x={Math.sin(axisAngle(i)) * this.state.rScale(1) + (Math.sin(axisAngle(i)) ? ((axisAngle(i) > Math.PI) ? -(this.state.textWidth / 2) : (this.state.textWidth / 2)) : 0)}
                                                      y={-Math.cos(axisAngle(i)) * this.state.rScale(1.1)}
                                                      style={{fontSize: '0.9rem'}}
                                                      width={this.state.textWidth}>{a.label}</Text>)}
                        </g>
                        <g className={"links"}
                           fill={"none"} strokeOpacity={1} strokeWidth={2}>
                            {this.state.data.map((d, i) => <path d={this.state.radarLine(d)}
                                                                 strokeOpacity={this.props.selectedIndex === undefined ? 1 : (this.props.selectedIndex === (this.props.keyColor ? d[this.props.keyColor] : i) ? 1 : 0.1)}
                                                                 stroke={this.state.colors(this.props.keyColor ? d[this.props.keyColor] : i)}/>)}
                        </g>
                    </g>
                    <g className={"legend"}
                       fontFamily={"sans-serif"}
                       fontSize={this.state.fontSize+3}
                       transform={`translate(${[this.state.margin.left + this.state.radius() - this.state.legendW*this.state.levels.length/2, this.state.height- this.state.legendH -30]})`}>
                        {this.state.levels.map((l, li) => <rect key={li}
                            x={(li) * this.state.legendW}
                            width={this.state.legendW}
                            height={this.state.legendH}
                            fill={this.state.colorLevels(l)}
                            stroke={'#fff'} strokeOpacity={1} strokeWidth={1}
                            fillOpacity={0.3}></rect>)}
                            <text dy={-this.state.legendH/2-2} alignmentBaseline="middle" x={(this.state.levels.length/2) * this.state.legendW} textAnchor={"middle"} fontSize={this.state.fontSize+8}>Well-being of the patient</text>
                            <text dy={this.state.legendH/2} alignmentBaseline="middle" dx={this.state.legendW/2} x={(this.state.levels.length -1) * this.state.legendW} textAnchor={"middle"}>Good</text>
                            <text dy={this.state.legendH/2} alignmentBaseline="middle" dx={this.state.legendW/2}  textAnchor={"middle"}>Bad</text>
                    </g>
                </svg>
            </div>
        );
    }


}

export default withStyles(styles)(RadarChart);
