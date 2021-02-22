import React, { Component } from 'react';
import {stratify} from 'd3-hierarchy';
import * as d3 from 'd3';
import { scaleOrdinal } from 'd3-scale';
import {RULLwaring} from './RULwarningMap'
import {makeStyles, withStyles} from "@material-ui/core/styles";

const styles =  theme=> ({
    menu: {
        marginLeft: '5px',
        marginRight: '5px',
        display: 'flex',
        position:"absolute",
        width: '100%',
        top: '10px',
        left:0,
    }
});

class RadarChart extends React.Component{
    constructor(props) {
        super(props);
        this.svg = React.createRef();
        this.state = {
            // labels: [],
            data: data,
            opts:{
                margin: {top: 50, right: 100, bottom: 0, left: 60},
                width: 500,
                height: 500,
                scalezoom: 1,
                widthView: function () {
                    return this.width * this.scalezoom
                },
                heightView: function () {
                    return this.height * this.scalezoom
                },
                widthG: function () {
                    return this.widthView() - this.margin.left - this.margin.right
                },
                heightG: function () {
                    return this.heightView() - this.margin.top - this.margin.bottom
                },
                _fontSize: this.props.displayName==='Hardware Part Description' ? 12:14,
                fontSize: this.props.displayName==='Hardware Part Description' ? 12:14,
            },
            zoomTransform: {x:0,y:0,k:1},
            fontSize: 12,
            colors:props.colors.domain?props.colors:scaleOrdinal().range(["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"])
        };
        this.zoom = d3
            .zoom()
            .scaleExtent([-5, 5])
            .on("zoom", this.zoomed.bind(this));
    }
    zoomed(event) {
        this.setState({
            zoomTransform: event.transform,
            fontSize: this.state.opts.fontSize/event.transform.k
        });
    }
    adjustFont(){
        if(this.svg.current){
            const currentWidth= this.svg.current.width.baseVal.value;
            if (currentWidth){
                const fontSize = this.state.opts._fontSize*this.state.opts.width/currentWidth;
                const fontSize_adjust = fontSize/this.state.zoomTransform.k;
                if(this.state.opts.fontSize!==fontSize || fontSize_adjust!==this.state.fontSize){
                    this.state.opts.fontSize=fontSize;
                    this.setState({fontSize:fontSize/this.state.zoomTransform.k});
                }}
        }
    }
    colorBattery = d3.scaleThreshold()
        .domain([0.1, 0.2])
        .range(["red", "orange", "green"]);
    componentDidMount() {
        if (!this.props.disableZoom)
            d3.select(this.svg.current).call(this.zoom);
        this.adjustFont()
    }
    componentDidUpdate(prevProps) {
        this.adjustFont();
    }
    onSelect(n){
        this.props.selected(n.id,this.handleInfo(n));
        this.setState({selected:n});
    }
    handleInfo(n){
        const data = Object.assign({}, n.data.info);
        data.id = n.data.id;
        return data;
    }
    onMouseOver(n){
        this.props.onSelect(this.handleInfo(n));
    }
    onMouseLeave(){
        this.props.onSelect(null);
    }
    render(){
        const { classes } = this.props;
        const treeLink = d3.linkHorizontal().x(d => d.y).y(d => d.x);
        const selected = this.state.data.descendants().find(d=>d.id===this.props.selected());
        let highlightL = new Set([]);
        if (selected)
            highlightL = new Set(selected.descendants().filter(d=>d.data.value!=='delete'));
        const highlight = d => highlightL.has(d);
        if (selected) {
            if (selected !== this.state.selected) {
                // this.props.selected(selected.id, selected.data.info, {colors: this.state.colors});
                this.props.selected(selected.id, this.handleInfo(selected));
                this.setState({selected});
            }
        }

        const iconsize =10;
        const battery_render = (n)=>{
            let percentage = this.props.dataRUL?this.props.dataRUL['Memsys_id'][n.data.id]??((n.data.info&&n.data.info['Hardware Info'])?this.props.dataRUL['Part Num'][n.data.info['Hardware Info'][0]['Hardware Part Number']]:undefined):undefined;
            if (percentage!==undefined)
                if (percentage<0)
                    percentage = 0;
            return <g transform={`translate(${-iconsize},${-iconsize/1.9})`}>
                {((this.props.onSelect()??{}).id===n.data.id)?<rect width={iconsize*2.5} height={iconsize*1.5} transform={`translate(${-iconsize*0.25},${-iconsize*0.25})`} rx={3} fill="black" stroke="none">
                    <animate attributeName="opacity" values="0;0.5;0" dur="2s" repeatCount="indefinite" />
                </rect>:''}
                <rect width={iconsize*2.1} height={iconsize} fill="white" stroke="none"></rect>
                <rect fill={this.colorBattery(percentage/100)} width={percentage/100*iconsize*2.1} height={iconsize} stroke="none"></rect>
                <rect width={iconsize*2.1} height={iconsize} rx={2} fill="none" strokeWidth={2} stroke="white"></rect>
                <rect width={iconsize*2.1} height={iconsize} rx={2} fill="none" strokeWidth={0.5} stroke="#444"></rect>
            </g>
            return <g transform={`translate(${-iconsize},${-iconsize/2})`}>
                <rect width={iconsize*2} height={iconsize} fill="white" strokeDasharray={"1 1"} strokeWidth={1} stroke={"black"}></rect>
            </g>
        };
        const _iconsize = this.props.isCircle?iconsize: iconsize/2;
        const render = (n)=>{
            if (n.parent==null)
                return <circle r={3} fill={highlight(n) ? "black" : "white"} stroke={"black"} strokeWidth={1}></circle>
            if(n.data.info&&n.data.info['Member System Id']){
                let out = '';
                let offset = 0;
                if (n.data.errorType || !(this.props.displayName==='Issue Icons'))
                {
                    if (this.props.isCircle)
                        return <circle r={3} fill={highlight(n) ? this.state.colors(n.id) : n.children ? "#555" : "#999"}></circle>
                    else
                        return out
                }
                if (n.data.warningType){
                    n.data.warningType.forEach(type=>{
                        if (!this.props.notificationHidden[type]){
                            out = <>{out} <g transform={`translate(${offset+iconsize*3/2},${(-_iconsize)})`}
                                             fill={highlight(n) ? "black" : "#999"}>
                                {<RULLwaring type={type} size={_iconsize*2}/>}
                            </g></>;
                            offset += _iconsize;
                        }
                    });
                    return out;
                }
            }
            if (this.props.isCircle)
                return <circle r={5} fill={highlight(n) ? this.state.colors(n.id) : "white"} strokeDasharray={"1 1"} stroke={"black"} strokeWidth={1}></circle>
            return ''
        };
        // this.adjustFont();
        return(
            <div style={{position:'relative',overflow:"visible"}}>
                <svg viewBox={"0 0 "+this.state.opts.width+' '+this.state.opts.height} ref={this.svg} style={{overflow:"visible"}}
                     id={this.props.id}>
                    <g className={"content"}
                       fontFamily={"sans-serif"}
                       fontSize={12}
                       transform={`translate(${[this.state.opts.margin.left+this.state.zoomTransform.x,this.state.opts.margin.top+this.state.opts.dx-this.state.opts.x0+this.state.zoomTransform.y]}) scale(${this.state.zoomTransform.k}) `}>
                        <g className={"links"}
                           fill={"none"} stroke={'#000'} strokeOpacity={"0.1"} strokeWidth={0.5}>
                            {this.state.data.links().map(l=>
                                (l.target.data.value!=='delete')?<path d={treeLink(l)}
                                                                       fill={'none'}
                                    // stroke={highlight(l.source) && highlight(l.target) ? this.state.colors(l.target.id) : null}
                                    // stroke={highlight(l.source) && highlight(l.target) ? '#000' : null}
                                                                       strokeOpacity={highlight(l.source) && highlight(l.target) ? 0.75 : null}
                                                                       strokeDasharray={(this.props.mode&&(l.target.data.value==='add'))?'4 2':null}
                                                                       key={l.source.id+l.target.id}
                                />:'')}
                        </g>
                        <g className={"nodes"}>{this.state.data.descendants().map(n=>
                            <g strokeLinejoin="round" strokeWidth="3" transform={`translate(${n.y},${n.x})`} key={n.id}
                               opacity={highlight(n)?1:0.2}
                               style={{pointerEvents:n.data.value==='delete'?'none':null}}
                               onClick={(e) => {this.onSelect(n)}}
                               onMouseOver={(e)=>{this.setState({mouse:{x:e.nativeEvent.offsetX,y:e.nativeEvent.offsetY,target:n.data.info}});
                                   this.onMouseOver(n)}}
                               onMouseLeave={(e)=>{this.setState({mouse:undefined});this.onMouseLeave();}}>
                                {(this.props.isCircle || (n.parent==null)) ?'':battery_render(n)}
                                {render(n)}
                                <text dy="0.31em" fill={highlight(n) ? this.state.colors(n.id) : null} x={(n.children ? -6 : 6)*(1+(+!this.props.isCircle)*1.2)} textAnchor={n.children?"end":"start"} vector-effect="non-scaling-stroke" stroke={"white"} fontSize={this.state.fontSize}>{this.getName(n)}</text>
                                <text dy="0.31em" fill={highlight(n) ? this.state.colors(n.id) : null} x={(n.children ? -6 : 6)*(1+(+!this.props.isCircle)*1.2)} textAnchor={n.children?"end":"start"} fontSize={this.state.fontSize}>{this.getName(n)}</text>
                            </g>)}</g>
                    </g>
                </svg>
            </div>
        );
    }



}

export default withStyles(styles) (RadarChart);
