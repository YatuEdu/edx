class UIUtil {
    /**
     * text，selector, date
     */
    static uiEnterEdit(element, type, data) {

        if (data instanceof Array) {
            let map = new Map();
            for(let d of data) {
                map.set(d, d);
            }
            data = map;
        }
        switch (type) {
            case 'text':
                let textCurr = element.html();
                if (textCurr==null) textCurr = '';
                element.html('');
                let textInput = $(`
                    <input class="form-control form-control-lg">
                `);
                textInput.val(textCurr);
                element.append(textInput);
                break;
            case 'selector':
                let selectCurr = element.html();
                element.html('');
                let selector = $(`
                    <select class="form-select form-control-lg">
                    </select>
                `);
                data.forEach(function(value, key) {
                    $(selector).append($('<option>', {
                        value: value,
                        text: key
                    }));
                    if (key===selectCurr) {
                        selector.val(value);
                    }
                });
                element.append($(selector));
                break;
            case 'date':
                let dateCurr = element.html();
                element.html('');
                let dateSelector = $(`
                    <input id="effectiveDateInput" type="date" min="1922-04-30" name="dob"
                     class="form-control form-control-lg date_for_3"/>
                `);
                dateSelector.val(dateCurr);
                element.append($(dateSelector));
                break;
        }
    }

    static uiExitEdit(element, type) {
        let elementVal = null;
        let elementText = null;
        switch (type) {
            case 'text':
                elementVal = element.find("input").val();
                element.empty();
                element.html(elementVal);
                return elementVal;
            case 'selector':
                elementVal = element.find("select").val();
                elementText = element.find("select option:selected").text();
                element.empty();
                element.html(elementText);
                return elementVal;
            case 'date':
                elementVal = element.find("input").val();
                element.empty();
                element.html(elementVal);
                return elementVal;
        }
    }

    static drawLineSeries(canvas, xs, values, valueName) {
        let myChart = echarts.init(canvas[0]);
        $(window).resize(() => {
            myChart.resize();
        });
        let option = {
            tooltip: {
                trigger: 'axis',
                formatter:'<span style="color:rgba(29, 37, 79, 1);font-size:14px;font-weight:700;">{c} '+valueName+'</span><br /><span style="font-size:12px;color:rgba(60, 60, 67, 0.6);">{b}</span>' ,
            },
            grid: {
                left: 40,
                right: 20,
                bottom: 40,
            },
            legend:{
                show: true,
                top: 10,
                right: 10,
            },
            xAxis: {
                //type: 'time',
                boundaryGap: false,
                axisTick: {
                    show: false,
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    color: "rgba(31, 21, 52, 0.5)",
                    //formatter: '{dd}',
                },
                axisPointer: {
                    type: "line",
                    lineStyle: {
                        color: "#458FF6",
                    }
                },
                data: xs
            },
            yAxis: {
                axisLabel: {
                    color: "rgba(31, 21, 52, 0.5)"
                },
            },
            series: [
                {
                    data: values,
                    type: 'line',
                    smooth: true,
                    symbol: "circle",
                    symbolSize: 10,
                    showSymbol: false,
                    itemStyle: {
                        color: "rgba(56, 133, 240, 1)",
                        borderColor: "rgba(255,255,255, 1)",
                        borderWidth: 2.69,
                    },
                    lineStyle: {
                        normal: {
                            color: '#458FF6',
                            width: 3,
                        }
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgba(23, 109, 228, 0.31)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(23, 109, 228, 0.03)'
                            }
                        ])

                    }
                }

            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }

    static drawPieCharts(canvas, xs, values, valueName) {
        let myChart = echarts.init(canvas[0]);
        $(window).resize(() => {
            myChart.resize();
        });
        let option = {
            color: ["#0C67E7", "#458FF6","#79B0FD","#94C0FE","#A2C8FE","#AFD0FE","#BED9FE","#DCDDDF","#335D97","#849DF5"],
            legend: {
                show: true,
                icon: "circle",
                textStyle: {
                    color: "rgba(125, 132, 159, 1)"
                },
                itemGap: 15,
                itemWidth: 10,
                itemHeight: 10,
                bottom: 15,
            },
            tooltip: {
                trigger: 'item',
                formatter:'<span style="font-size:10px;color:rgba(60, 60, 67, 0.6);">{a}</span><br /><span style="color:rgba(29, 37, 79, 1);font-size:14px;font-weight:700;">{c} USD</span><br /><span style="font-size:11px;color:rgba(125, 132, 159, 1)">{b} {d}%</span>' ,
                borderColor: 'rgba(255,255,255,0)',
            },
            series: [
                {
                    name: 'March 2020',
                    type: 'pie',
                    label: {
                        show: false,
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        {
                            value: 613321,
                            name: 'Other1'
                        },
                        {
                            value: 527100,
                            name: 'Other2'
                        },
                        {
                            value: 235860,
                            name: 'Other'
                        }
                    ],
                    radius: ['60%', '80%']
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

    }
}

export {UIUtil}
