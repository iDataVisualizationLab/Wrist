import * as d3 from "d3";

export const axis = [
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
        label: 'MHQ work module (1-5 / 1=always, 2=often, 3=sometimes, 4=rarely, 5=never)',
        range: [1, 100]
    },
    {
        id: 'Wrist range motion Flexion/Extension',
        label: 'Wrist range motion Flexion/Extension (0= no ROM- 100% equal or better than contra-lateral  wrist )',
        range: [0, 100]
    },
    {
        id: 'Wrist range motion Pronation/Supination',
        label: 'Wrist range motion Pronation/Supination  (0= no ROM- 100% equal or better than contra-lateral wrist )',
        range: [0, 100]
    },
    {
        id: 'Wrist range motion Radial / Ulnar Deviation',
        label: 'Wrist range motion Radial / Ulnar Deviation (0= no ROM- 100% equal or better than contra-lateral wrist )',
        range: [0, 100]
    },
    {
        id: 'Grip Strength Ratio',
        label: 'Grip Strength Ratio  (0= no  grip strength - 100% equal or better than  contra-lateral wrist )',
        range: [0, 100]
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
export const axisAngle = d3.scaleLinear().domain([0, axis.length]).range([0, Math.PI * 2]);

const formatMillisecond = d3.timeFormat(".%L"),
    formatSecond = d3.timeFormat(":%S"),
    formatMinute = d3.timeFormat("%I:%M"),
    formatHour = d3.timeFormat("%I %p"),
    formatDay = d3.timeFormat("%a %d"),
    formatWeek = d3.timeFormat("%b %d"),
    formatMonth = d3.timeFormat("%B"),
    formatYear = d3.timeFormat("%Y");

export function multiFormat(date) {
    return (d3.timeSecond(date) < date ? formatMillisecond
        : d3.timeMinute(date) < date ? formatSecond
            : d3.timeHour(date) < date ? formatMinute
                : d3.timeDay(date) < date ? formatHour
                    : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? formatDay : formatWeek)
                        : d3.timeYear(date) < date ? formatMonth
                            : formatYear)(date);
}
