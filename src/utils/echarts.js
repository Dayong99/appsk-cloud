//--------------------------------------
// Copyright (c) 2021.
// 作者：梁士博(Mr.liang)
// 日期：2021-02-04 15:27:57
// Copyright (c) 2021.
//--------------------------------------

import Vue from 'vue'
import 'echarts/lib/component/legendScroll'

export default {
    /**
     * 获取竖柱状图默认设置
     * @returns *
     */
    getDefaultBarColumnOption() {
        return {
            title: {
                x: 'left',
                show: true,//显示策略，默认值true,可选为：true（显示） | false（隐藏）
                text: '',//主标题文本，'\n'指定换行
                textStyle: {//主标题文本样式
                    color: '#555',
                    fontSize: 16,
                },
            },
            color: ['#00c8ff'],
            toolbox: {
                orient: 'horizontal',
                y: 'top',
                featureTitle: {
                    mark: false,
                }
            },
            tooltip: {
                showDelay: 20,
                hideDelay: 100,
                transitionDurantion: .3,
                backgroundColor: 'rgba(0,0,0,.3)',
                borderRadius: 4,
                borderWidth: 0,
                trigger: 'axis',
                textStyle: {//主标题文本样式
                    color: '#fff',
                    fontSize: 10,
                },
                axisPointer: {
                    type: 'line',         // 默认为直线，可选为：'line' | 'shadow'
                    lineStyle: {          // 直线指示器样式设置
                        color: 'rgba(0,0,0,0)',
                        width: 0,
                        type: 'solid'
                    },
                    shadowStyle: {              // 阴影指示器样式设置
                        width: 0,         // 阴影大小
                        color: 'rgba(0,0,0,0.3)'  // 阴影颜色
                    },
                },
            },
            grid: {
                bottom: '4%',
                left: '25%',
                containLabel: false
            },
            categoryAxis: {
                boundaryGap: false,     // 类目起始和结束两端空白策略
                axisLine: {            // 坐标轴线
                    show: false,         // 默认显示，属性show控制显示与否
                    lineStyle: {        // 属性lineStyle控制线条样式
                        color: '#48b',
                        width: 2,
                        type: 'solid'
                    }
                },
                axisTick: {            // 坐标轴小标记
                    show: false,       // 属性show控制显示与否，默认不显示
                    interval: 'auto',
                    // onGap: null,
                    inside: false,        // 控制小标记是否在grid里
                    length: 5,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: '#333',
                        width: 1
                    }
                },
                axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                    show: false,
                    interval: 'auto',
                    rotate: 0,
                    margin: 8,
                    // formatter: null,
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: '#333'
                    }
                },
                splitArea: {                // 分隔区域
                    show: false,       // 默认不显示，属性show控制显示与否
                    // onGap: null,
                    areaStyle: {        // 属性areaStyle（详见areaStyle）控制区域样式
                    }
                }
            },
            yAxis: {
                type: "category",
                data: [],
                axisLabel: {
                    show: true,
                    textStyle: {//x轴文字样式
                        color: '#999'
                    },
                    formatter: function (value) {
                        let res = value;
                        if (res.length > 6) {
                            res = res.substring(0, 6) + "..";
                        }
                        return res;
                    }
                },
                axisLine: {//x轴线的颜色
                    show: true,
                    lineStyle: {
                        color: '#eee'
                    }
                },
                splitLine: {                // 分隔线
                    show: false,        // 默认显示，属性show控制显示与否
                },
            },
            xAxis: {
                type: "value",
                data: [],
                axisLabel: {
                    show: true,
                    textStyle: {//x轴文字样式
                        color: '#fff',
                        fontSize: 14
                    }
                },
                axisLine: {//x轴线的颜色
                    show: false,
                    lineStyle: {
                        color: '#fff'
                    }
                },
                splitLine: {                // 分隔线
                    show: false,        // 默认显示，属性show控制显示与否
                },
            },
            series: [{
                name: "查获数量",
                barWidth: 20,
                barGap: 20,
                barCategoryGap: '20%',
                type: "bar",
                itemStyle: {
                    normal: {
                        color: Vue.prototype.$echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            //给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变
                            //给第一个设置0，第四个设置1，就是垂直渐变
                            offset: 1,
                            color: 'rgba(30,181,229,.9)'
                        }, {
                            offset: 0,
                            color: 'rgba(92,203,177,.3)'
                        }]),
                    }
                },
                data: [],
            }],
            dataZoom: [//给x轴设置滚动条
                {
                    start: 100,//默认为0
                    end: 50,//默认为100
                    type: 'slider',
                    show: true,
                    yAxisIndex: [0],
                    handleSize: 10,//滑动条的 左右2个滑动条的大小
                    height: '60%',//组件高度
                    top: '20%',
                    right: '0%', //左边的距离
                    width: 14,
                    handleStyle: {
                        borderColor: "#fff",
                        borderWidth: "1",
                        shadowBlur: 2,
                        background: "#ddd",
                        shadowColor: "#ddd",
                    },
                    fillerColor: Vue.prototype.$echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                        //给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变
                        //给第一个设置0，第四个设置1，就是垂直渐变
                        offset: 0,
                        color: 'rgba(30,181,229,.5)'
                    }, {
                        offset: 1,
                        color: 'rgba(92,203,177,.5'
                    }]),
                    // fillerColor: 'rgba(76,160,255,.5)',
                    backgroundColor: 'rgba(0,0,0,.15)',//两边未选中的滑动条区域的颜色
                    showDataShadow: true,//是否显示数据阴影 默认auto
                    showDetail: false,//即拖拽时候是否显示详细数值信息 默认true
                    realtime: true, //是否实时更新
                    filterMode: 'filter',
                    borderColor: 'rgba(0,0,0,0)',
                    shadowColor: 'rgba(0,0,0,.8)',
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                },
                //下面这个属性是里面拖到
                {
                    type: 'inside',
                    show: true,
                    yAxisIndex: [0],
                    start: 0,//默认为1
                    end: 50,//默认为100
                },
            ],
        }
    },
    /**
     * 获取饼图的默认设置
     */
    getDefaultPieOption() {
        return {
            tooltip: {
                show: true,
                textStyle: { //设置鼠标移动上去的文字样式
                    color: '#fff',
                    fontSize: 16
                },
                trigger: "item",
                formatter: "{b}: {c} ({d}%)",
                showDelay: 20,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
                hideDelay: 100,            // 隐藏延迟，单位ms
                transitionDuration: 0.4,         // 动画变换时间，单位s
                backgroundColor: 'rgba(0,0,0,0.7)',  // 提示背景颜色，默认为透明度为0.7的黑色
                borderColor: '#333',            // 提示边框颜色
                borderRadius: 4,                // 提示边框圆角，单位px，默认为4
                borderWidth: 0,                // 提示边框线宽，单位px，默认为0（无边框）
                padding: 5,                   // 提示内边距，单位px，默认各方向内边距为5，
                // 接受数组分别设定上右下左边距，同css
                axisPointer: {                 // 坐标轴指示器，坐标轴触发有效
                    type: 'line',         // 默认为直线，可选为：'line' | 'shadow'
                    lineStyle: {          // 直线指示器样式设置
                        color: '#48b',
                        width: 2,
                        type: 'solid'
                    },
                    shadowStyle: {              // 阴影指示器样式设置
                        width: 'auto',         // 阴影大小
                        color: 'rgba(150,150,150,0.3)'  // 阴影颜色
                    }
                }
            },
            title: {
                x: 'left',
                show: true,//显示策略，默认值true,可选为：true（显示） | false（隐藏）
                text: '',//主标题文本，'\n'指定换行
                textStyle: {//主标题文本样式
                    color: '#555',
                    fontSize: 16,
                },
            },
            //内部图层配置
            grid: {
                // //上右下左属性等于一个相对父级的定位
                left: "0%",
                right: "0%",
                bottom: "",
                top: '0',
                containLabel: true,
            },
            color: ['#3FEEA5', '#32c5e9', '#67e0e3', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#fb7293', '#e062ae', '#e690d1', '#e7bcf3', '#9d96f5', '#8378ea', '#96bfff'],//设置颜色
            legend: {//设置图例部分
                show: true,
                textStyle: { //设置图例文字的样式
                    color: '#fff',//设置颜色
                    fontSize: 12,
                },
                itemWidth: 12,
                itemHeight: 12,
                itemGap: 5,
                orient: "vertical",
                //设置图例的位置，bottom、left、left、right
                right: '0',
                top: '20',
            },
            series: [
                {
                    name: "",
                    type: "pie",
                    center: ['30%', '54%'],
                    radius: ["0%", "80%"],//控制内圈和外圈圆的大小
                    roseType: '',
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: "left",
                    },
                    emphasis: {
                        label: {
                            show: false,
                            fontSize: "14",
                            fontWeight: "bold",
                        },
                    },

                    labelLine: {
                        show: true,
                    },
                    data: [],//数值
                },
            ],
        }
    },
    /**
     * 获取横柱状图的默认设置
     */
    getDefaultBarOption() {
        return {
            title: {
                x: 'left',
                show: true,//显示策略，默认值true,可选为：true（显示） | false（隐藏）
                text: '',//主标题文本，'\n'指定换行
                textStyle: {//主标题文本样式
                    color: '#555',
                    fontSize: 16,
                },
            },
            color: '#00c8ff',
            toolbox: {
                orient: 'horizontal',
                y: 'top',
                featureTitle: {
                    mark: false,
                }
            },
            tooltip: {
                showDelay: 20,
                hideDelay: 100,
                transitionDurantion: .3,
                backgroundColor: 'rgba(0,0,0,.3)',
                borderRadius: 4,
                borderWidth: 0,
                trigger: 'axis',
                textStyle: {//主标题文本样式
                    color: '#fff',
                    fontSize: 10,
                },
            },
            axisPointer: {
                type: 'line',         // 默认为直线，可选为：'line' | 'shadow'
                lineStyle: {          // 直线指示器样式设置
                    color: 'rgba(0,0,0,0)',
                    width: 0,
                    type: 'solid'
                },
                shadowStyle: {              // 阴影指示器样式设置
                    width: 0,         // 阴影大小
                    color: 'rgba(0,0,0,0.3)'  // 阴影颜色
                },
            },
            legend: {//设置图例部分
                show: false,
                textStyle: { //设置图例文字的样式
                    color: '#999',//设置颜色
                    fontSize: 12,
                },
                itemWidth: 12,
                itemHeight: 12,
                itemGap: 5,
                orient: "vertical",
                //设置图例的位置，bottom、left、left、right
                right: '0',
                top: '20',
            },
            grid: {
                bottom: '40',
                left: '36',
                top: 36,
                containLabel: false,
                right: 16
            },
            categoryAxis: {
                boundaryGap: false,     // 类目起始和结束两端空白策略
                axisLine: {            // 坐标轴线
                    show: false,         // 默认显示，属性show控制显示与否
                    lineStyle: {        // 属性lineStyle控制线条样式
                        color: '#48b',
                        width: 2,
                        type: 'solid'
                    }
                },
                axisTick: {            // 坐标轴小标记
                    show: false,       // 属性show控制显示与否，默认不显示
                    interval: 'auto',
                    // onGap: null,
                    inside: false,        // 控制小标记是否在grid里
                    length: 5,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: '#333',
                        width: 1
                    }
                },
                axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                    show: false,
                    interval: 'auto',
                    rotate: 0,
                    margin: 8,
                    // formatter: null,
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: '#333'
                    }
                },
                splitArea: {                // 分隔区域
                    show: false,       // 默认不显示，属性show控制显示与否
                    // onGap: null,
                    areaStyle: {        // 属性areaStyle（详见areaStyle）控制区域样式
                    }
                }
            },
            xAxis: {
                data: [],
                axisLabel: {
                    show: true,
                    textStyle: {//x轴文字样式
                        color: '#999',
                        fontSize: 14
                    }
                },
                axisLine: {//x轴线的颜色
                    show: true,
                    lineStyle: {
                        color: '#eee'
                    }
                },
                splitLine: {
                    show: false
                },
            },
            yAxis: {
                axisLabel: {
                    show: true,
                    textStyle: {//x轴文字样式
                        color: '#999',
                        fontSize: 14
                    }
                },
                axisLine: {//x轴线的颜色
                    show: true,
                    lineStyle: {
                        color: '#eee'
                    }
                },
                splitLine: { // 参考线
                    show: true,
                    color: 'block'
                },

            },
            series: [{
                name: "查获数量",
                barWidth: 20,
                barGap: 20,
                barCategoryGap: '20%',
                type: "bar",
                itemStyle: {
                    normal: {
                        color: Vue.prototype.$echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                            //给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变
                            //给第一个设置0，第四个设置1，就是垂直渐变
                            offset: 0,
                            color: '#009cff'
                        }, {
                            offset: 1,
                            color: '#ae53e7'
                        }]),

                    }
                },
                data: [],
            }],
        }
    },
    /**
     * 获取折线图的默认设置
     */
    getDefaultLineOption() {
        return {
            title: {
                x: 'left',
                show: true,//显示策略，默认值true,可选为：true（显示） | false（隐藏）
                text: '',//主标题文本，'\n'指定换行
                textStyle: {//主标题文本样式
                    color: '#555',
                    fontSize: 16,
                },
            },
            //鼠标移动上去的信息窗口
            tooltip: { //鼠标移动上去的信息窗口
                //show:false,
                trigger: "axis",
                axisPointer: {
                    //鼠标移动到图表显示十字
                    // type: "cross",
                    //文本框框的样式
                    label: {
                        backgroundColor: "#6a7985",//背景颜色
                    },
                },
            },
            //设置图例部分
            legend: {
                show: true,
                textStyle: { //设置图例文字的样式
                    color: '#fff',
                    fontSize: 12,
                },
                orient: "horizontal",
                //设置图例的位置，bottom、left、left、right
                right: 'center',
                top: '0',
            },
            //内部图层配置
            grid: {
                // //上右下左属性等于一个相对父级的定位
                left: 16,
                right: 16,
                bottom: 20,
                containLabel: true,
            },
            //操作x轴的配置
            xAxis: [{
                type: "category",
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                //两边的留白
                boundaryGap: false,
                axisLabel: {
                    show: true,
                    textStyle: {//x轴文字样式
                        color: '#999'
                    }
                },
                axisLine: {//x轴线的颜色
                    lineStyle: {
                        color: '#eee'
                    },
                },
                splitLine: { // 参考线
                    show: false,
                    color: '#eee'
                },

            }],
            //操作y轴的配置
            yAxis: [{
                type: "value",
                axisLabel: {//y轴文字样式
                    show: true,
                    textStyle: {
                        color: '#999'
                    }
                },
                axisLine: {//y轴线的颜色
                    show: false,
                    lineStyle: {
                        color: '#eee'
                    },
                },
                splitLine: { // 参考线
                    show: true,
                    color: 'block'
                },
                data: [],

            }],
            //操作数据类型和数据的配置
            series: [{
                name: '去年',
                type: "line",
                // stack: "总量",
                areaStyle: {
                    global: false,
                    type: 'default',
                    color: Vue.prototype.$echarts.graphic.LinearGradient(0, 0, 0, 1,//变化度
                        //两种由深及浅的颜色
                        [{
                            offset: 0,
                            color: 'rgba(93,236,133,.8)'
                        }, {
                            offset: 1,
                            color: 'rgba(93,236,133,.4)'
                        }]),
                },
                symbol: 'emptyCircle',
                symbolSize: 2,//拐点大小
                // 折线弧度
                smooth: .5,
                color: ['#4dd08a'],
                itemStyle: {
                    normal: {
                        lineStyle: {
                            width: 2,
                            // color:'#70c8ee',
                            type: 'solid',//dottde虚线  solid 实线
                            color: 'rgba(77,208,138,1)',// 线颜色
                        },
                        label: {
                            show: true,
                            borderColor: '',
                            borderWidth: 2
                        }
                    }
                },
                data: [],
            }]

        }
    }
}
