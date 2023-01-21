import React from 'react';
import * as d3 from 'd3';
import {scaleLinear} from 'd3-scale';
import {withStyles} from "@material-ui/core/styles";
import {axis, axisAngle,multiFormat} from "./parameter";
import * as _ from 'lodash';

const styles = theme => ({});

class WristChart extends React.Component {
    constructor(props) {
        super(props);
        this.svg = React.createRef();
        this.state = {
            opts:{fontSize:12},
            margin: {top: 30, right: 30, bottom: 60, left: 60},
            width: 800,
            height: 300,
            data: [],
            widthG: function () {
                return this.width - this.margin.left - this.margin.right
            },
            heightG: function () {
                return this.height - this.margin.top - this.margin.bottom
            },
            fontSize: 14,
            LineFunc: d3.line()
                // .interpolate("linear-closed")
                .curve(d3.curveMonotoneX)
                .x((d) => {
                    return this.xScale(d.time);
                })
                .y((d) => {
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
            zoomTransform: {x:0,y:0,k:1,rescaleX:(d)=>d,rescaleY:(d)=>d},
        };
        this.xScale = d3.scaleTime();
        this.yScale = scaleLinear();
        this.state.colorLevels = scaleLinear().domain([0, 0.25, 0.5, 0.75, 1]).range(['#d7191c', '#fdae61', '#ffffbf', '#a6d96a', '#1a9641']);
        axis.forEach(a => a.scale = d3.scaleLinear().domain(a.range));
        this.zoom = d3
            .zoom()
            .scaleExtent([-5, 5])
            .on("zoom", this.zoomed.bind(this));
    }
    zoomed(event) {
        this.setState({
            zoomTransform: event.transform,
            // fontSize: this.state.opts.fontSize/event.transform.k
        });
    }
    adjustFont(){
        if(this.svg.current){
            // const currentWidth= this.svg.current.width.baseVal.value;
            const currentWidth= this.svg.current.getBoundingClientRect().width;
            if (currentWidth){
                const fontSize = this.state.opts.fontSize*this.state.width/currentWidth;
                // const fontSize_adjust = fontSize/this.state.zoomTransform.k;
                if(this.state.fontSize!==fontSize){
                // if(this.state.fontSize!==fontSize || fontSize_adjust!==this.state.fontSize){
                //     this.state.fontSize=fontSize;
                //     this.setState({fontSize:fontSize/this.state.zoomTransform.k});
                    this.setState({fontSize:fontSize});
                }
            }
        }
    }
    componentDidMount() {
        this.state.rScale.range([0, 20]);
        this.xScale.range([0, this.state.widthG()]);
        this.yScale.range([this.state.heightG(), 0]);
        const data = this.handleData(this.props.data, this.props.label);
        this.xScale.domain(d3.extent(_.flatten(data), d => d.time));
        this.setState({data});
        d3.select(this.svg.current).call(this.zoom);
        this.adjustFont()
    }

    handleData(_data = [[]], _labels = []) {
        const data = _data.map((arr, arri) => {
            // console.log(arr)
            const drawData = arr.map((d,i) => {
                const ob = axis.map(a => a.scale(((typeof (d[a.id]) === 'object') && d[a.id]) ? d[a.id].result : d[a.id]));
                if (this.props.keyColor)
                    ob[this.props.keyColor] = d[this.props.keyColor];
                ob.mean = d3.mean(ob);
                ob.index = i;
                ob.time = new Date(d.Date);
                return ob;
            }).sort((a, b) => a.time - b.time);
            drawData.forEach((d,i)=>{
                if(i){
                    d.delta = d.mean-drawData[i-1].mean;
                }else
                    d.delta = undefined;
            })
            drawData.name = _labels[arri].name;
            drawData.id = _labels[arri].id ?? arri;
            return drawData;
        });
        return data;
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            const data = this.handleData(this.props.data, this.props.label);
            this.xScale.domain(d3.extent(_.flatten(data), d => d.time));
            this.setState({data});
        }
        this.adjustFont()
    }

    render() {
        const {classes} = this.props;
        const xScale = this.state.zoomTransform.rescaleX(this.xScale);
        const yScale = this.state.zoomTransform.rescaleY(this.yScale);
        // this.adjustFont();
        return (
            <div style={{position: 'relative', overflow: "hidden"}}>
                <svg viewBox={"0 0 " + this.state.width + ' ' + this.state.height}
                     preserveAspectRatio="xMidYMid meet"
                     ref={this.svg}
                     style={{overflow: "visible"}}
                     id={this.props.id}>
                    <rect className={"zoomTarget"} width={'500%'} height={'500%'} opacity={0}/>
                    <g className={"background"} transform={`translate(${[this.state.margin.left, this.state.margin.top]})`}>
                        <rect width={this.state.widthG()} height={this.state.heightG()} fill={'#ddd'}/>
                    </g>
                    <g className={"content"}
                       fontFamily={"sans-serif"}
                       fontSize={this.state.fontSize}
                       transform={`translate(${[this.state.margin.left+this.state.zoomTransform.x, this.state.margin.top+this.state.zoomTransform.y]})  scale(${this.state.zoomTransform.k})`}>
                        {this.state.data.map(arr => <g key={arr.id}
                                                       style={{opacity: this.state.highlight!==undefined?(arr.id===this.state.highlight.g.id?1:0.2):1}}>
                            <g className={"Line"}
                               fill={"none"} strokeOpacity={1} strokeWidth={0.5}>
                                <path d={this.state.LineFunc(arr)}
                                      stroke='black'/>
                            </g>
                            <g className={"Dots"}>
                                {arr.map((d, i) => <path d={this.state.radarLine(d)}
                                                         transform={`translate(${this.xScale(d.time)},${this.yScale(d.mean)})`}
                                    // strokeOpacity={this.props.selectedIndex === undefined ? 1 : (this.props.selectedIndex === (this.props.keyColor ? d[this.props.keyColor] : i) ? 1 : 0.1)}
                                                         fill={this.state.colorLevels(d.mean)}
                                                         fillOpacity={0.8}
                                    // stroke={this.state.colorLevels(d.mean)}
                                                         stroke={'black'}
                                                         strokeWidth={0.5}
                                                         onMouseOver={(event)=>{this.setState({highlight:{g:arr,el:d}})}} onMouseLeave={()=>this.setState({highlight:undefined})}
                                />)}
                                {arr.map((d, i) => <circle cx={this.xScale(d.time)}
                                                           cy={this.yScale(d.mean)}
                                                           r={2}
                                                           fill={'black'}/>)}
                            </g>
                        </g>)}
                    </g>
                    <g className={"axis"} transform={`translate(${[this.state.margin.left, this.state.margin.top]})`}>
                        <g className={"xaxis"} transform={`translate(${[0, this.state.heightG()]})`}>
                            <line x2={this.state.widthG()} stroke={'black'}/>
                            {xScale.ticks(10).map(t=><g className={"ticks"}>
                                <line transform={`translate(${[xScale(t),0]})`} y2={5} stroke={'black'}/>
                                <text x={xScale(t)} textAnchor={"middle"} y={5} dy={'1rem'} fontSize={this.state.fontSize}>{multiFormat(t)}</text>
                            </g>)}
                            <text y={5} dy={'2.5rem'} x={this.state.widthG()/2} textAnchor={"middle"} style={{fontWeight:'bold'}}>Dates of Evaluations</text>
                        </g>
                        <g className={"yaxis"} transform={`translate(${[0,0]})`}>
                            <line y2={this.state.heightG()} stroke={'black'}/>
                            {yScale.ticks(5).map(t=><g className={"ticks"}>
                                <line transform={`translate(${[0,yScale(t)]})`} x2={-5} stroke={'black'}/>
                                <text y={yScale(t)} textAnchor={"end"} x={-7} dy={6} fontSize={this.state.fontSize}>{t}</text>
                            </g>)}
                        </g>
                    </g>
                    {this.state.highlight?<g transform={`translate(${[this.state.margin.left+xScale(this.state.highlight.el.time)+25, this.state.margin.top+yScale(this.state.highlight.el.mean)-0]})`}
                                             fontSize={this.state.fontSize}
                                             style={{pointerEvents:'none'}}
                    >
                        <rect width={120} height={50} y={-10} x={-5} fill={'white'}/>
                        <text>Initials:</text>
                        <text x={30}>{this.state.highlight.g.name}</text>
                        <text y={12}>Date:</text>
                        <text y={12} x={30}>{this.state.highlight.el.time.toLocaleString()}</text>
                        <text y={24}>Score:</text>
                        <text y={24} x={30}>{d3.format('.2f')(this.state.highlight.el.mean)}</text>
                        <text y={36}>ΔScore:</text>
                        <text y={36} x={30}
                              fill={this.state.highlight.el.delta<0?'red':'green'}
                        >{this.state.highlight.el.index?d3.format('.2f')(this.state.highlight.el.delta):'-'}</text>
                    </g>:''}
                </svg>
            </div>
        );
    }
}

export default withStyles(styles)(WristChart);
