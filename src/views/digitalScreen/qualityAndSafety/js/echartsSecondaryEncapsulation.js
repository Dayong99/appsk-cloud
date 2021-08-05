import echarts from "@/utils/echarts";

export default {
  /**
   * 二次封装饼图
   * @returns *
   */
  //左饼图
  getLeftOption(data) {
    let option = echarts.getDefaultPieOption();
// option.grid = {
//       top: "55%",
//         left: "90px",
//         right: "50px",
//         bottom: "50px"
//     },
    option.tooltip.trigger = "item";
    option.legend = {
      show: false,
      type: "plain",
      // bottom: 20,
      // itemGap: 20,
      width: "auto",
      textStyle: {
        color: "#ffffff",
        fontSize: "14px",
      },
    };
    option.series = {
      name: "总人数",
      type: "pie",
      center: ["50%", "50%"],
      radius: ["35%", "80%"],
      // avoidLabelOverlap: false,
      bottom: "20%",
      label: {
        show: true,
        normal: {
          formatter: '{b}:{d}%',
          textStyle: {
            fontSize: 12,
            color: '#fff'
          }
        }
      },
      emphasis: {
        show: true,
      },
      labelLine: {
        show: true,
      },
      data: data
    };
    return option;
  },
  //中间折线图
  getMiddleOption(data, time) {
    let option = echarts.getDefaultLineOption();
      option.legend = {
        width: '800px',
        textStyle: { //设置图例文字的样式
          color: '#fff',
          fontSize: 12,
        },
      },
        option.color=[
            "rgba(255, 63, 63, 1)",
            "rgba(50, 197, 78, 1)",
            "rgba(242, 199, 97, 1)",
            "rgba(242, 153, 97, 1)",
            "rgba(0, 204, 205, 1)",
          ],
      option.xAxis = {
        // category: 'category',
        // boundaryGap: false,
        data: time,
      },
      option.yAxis = {
        type: 'value'
      },
      option.series = data
    return option
  },
  //右饼图
  getRightOption(data) {
    let option = echarts.getDefaultPieOption();

    option.tooltip.trigger = "item";
    option.legend = {
      type: "plain",
      // bottom: 20,
      // itemGap: 20,
      width: "auto",
      textStyle: {
        color: "#ffffff",
        fontSize: "14px",
      },
    };
    option.series = [{
      name: "总人数",
      type: "pie",
      center: ["50%", "74%"],
      // radius: ["50%", "70%"],
      // avoidLabelOverlap: false,
      bottom: "20%",
      label: {
        show: false,
        position: "center",
      },
      emphasis: {
        show: true,
      },
      labelLine: {
        show: true,
      },
      data: data
    }];

    return option;
  },
}