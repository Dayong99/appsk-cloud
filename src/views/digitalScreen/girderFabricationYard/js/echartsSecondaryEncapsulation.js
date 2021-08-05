import echarts from "@/utils/echarts";

export default {
  /**
   * 二次封装饼图
   * @returns *
   */
  //左饼图
  getLeftOption(data) {
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
    option.series = {
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
    };

    return option;
  },
  //右饼图
  getRightOption(data) {
    let option = echarts.getDefaultPieOption();

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
    option.series = [{
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
            color:'#fff'
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
    }];

    return option;
  },
}