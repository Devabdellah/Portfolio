app.post('/getchart/', (req, res) => {
    var sql = 'SELECT * FROM `Users` WHERE Email ="' + _escpe(req.body.Email) + '" AND LicenceKey="' + _escpe(req.body.LicenceKey) + '"';
    var query = db.query(sql, async (err, result) => {
        if (err) throw err;
        if (result.length != 0) {
            if (result[0].Status != "Active") {
                res.send({
                    Status: 'Paused'
                });
                return
            }

            var sql;
            var sqlgroup;
            var sqlarr = [];
            var sqlarr2 = [];
            var array2;
            var thismonth = new Date();
            var labels = [];

            if (req.body.selectedChart == "All") {

            } else {
                shopsql = `and OrderType = "${req.body.selectedChart}"`
            }

            req.body.type == req.body.el["data-type"]
            if (req.body.type == "Year") {
                sql = ` and EXTRACT(year FROM OrderDate) = "${req.body.el["yearselecteddata"]}"`;
                sqlgroup = `DATE_FORMAT(OrderDate, "%b")`;
                var year = req.body.el["yearselecteddata"];
                sqlarr = [];
                for (let i = 1; i < 13; i++) {
                    var date = new Date(Number(year), Number(i), 0);
                    sqlarr.push({ sql: sql + ` and DATE_FORMAT(OrderDate, "%b") = "${date.toDateString().substring(4, 7)}"`, month: date.toDateString().substring(4, 7) });
                }
                var labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            } else if (req.body.type == "Month") {

                var month = (req.body.el["monthselecteddata"].split(" - ")[0]);
                var year = (req.body.el["monthselecteddata"].split(" - ")[1]);

                sql = ``;
                sqlgroup = `DATE_FORMAT(OrderDate, "%b")`;

                var d = new Date(Number(year), Number(month), 0);
                thismonth = d;
                d.getDate();
                var arr = [];
                for (let i = 1; i < d.getDate() + 1; i++) {
                    arr.push(`DATE_FORMAT(OrderDate, "%Y-%m-%e") = "${year}-${month}-${i}"`);
                }
                var array = [arr.splice(0, Math.ceil(arr.length / 4)), arr.splice(0, Math.ceil(arr.length / 3)), arr.splice(0, Math.ceil(arr.length / 2)), arr.splice(0, Math.ceil(arr.length / 1))];
                array2 = [[1, array[0].length], [array[0].length + 1, array[0].length + array[1].length], [array[0].length + array[1].length + 1, array[0].length + array[1].length + array[2].length], [array[0].length + array[1].length + array[2].length + 1, array[0].length + array[1].length + array[2].length + array[3].length]];
                sqlarr = [];
                for (let i = 0; i < array.length; i++) {
                    const element = array[i];
                    var sql = `and (${array[i][0]}`;
                    for (let j = 1; j < element.length; j++) {
                        const elem = element[j];
                        sql += ` or ${elem}`;

                    }
                    sql += `)`;

                    sqlarr.push(sql);
                    sql = ``;
                }
            } else if (req.body.type == "Week") {

                var array = req.body.el["weekselecteddata"].split(" ");
                var sql = `and (DATE_FORMAT(OrderDate, "%Y-%m-%d") = "${array[0]}"`;
                for (let i = 1; i < array.length; i++) {
                    const element = array[i];
                    sql += ` or DATE_FORMAT(OrderDate, "%Y-%m-%d") = "${element}"`;
                }
                sql += `)`;

                sqlgroup = `DATE_FORMAT(OrderDate, "%a")`;
                labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            } else if (req.body.type == "Day") {

                var sql = `and DATE_FORMAT(OrderDate, "%Y-%m-%d") = "${req.body.el.value}"`;
                sqlgroup = `EXTRACT(hour FROM OrderDate)`;
                labels = ["12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM", "12 PM"]
            }





            if (req.body.type == 'Day') {
                sql = `SELECT ${sqlgroup} as label ,count(${sqlgroup}) as count FROM OrderHistory where email ="${_escpe(req.body.Email)}" ${sql} ${shopsql} group by ${sqlgroup} ORDER BY OrderDate ASC`
                var data = await PromisifiedQuery(sql)
                for (let i = 0; i < data.length; i++) {
                    data[i].label = (data[i].label > 12 ? `${data[i].label - 12} PM` : `${data[i].label} AM`)
                    if (data[i].label == `0 AM`) {
                        data[i].label = `12 PM`
                    }
                }
                res.send({
                    Status: "done",
                    data: data
                })
            } else if (req.body.type == 'Week') {
                sql = `SELECT ${sqlgroup} as label ,count(${sqlgroup}) as count FROM OrderHistory where email ="${_escpe(req.body.Email)}" ${sql} ${shopsql} group by ${sqlgroup} ORDER BY OrderDate ASC`
                var data = await PromisifiedQuery(sql)
                res.send({
                    Status: "done",
                    data: data
                })
            } else if (req.body.type == 'Month') {

                var data = []
                for (let i = 0; i < sqlarr.length; i++) {
                    const element = sqlarr[i];
                    sql = `SELECT ${sqlgroup} as label ,count(${sqlgroup}) as count FROM OrderHistory where email ="${_escpe(req.body.Email)}" ${element} ${shopsql} group by ${sqlgroup} ORDER BY OrderDate ASC`

                    var temp1 = await PromisifiedQuery(sql)
                    if (temp1.length != 0) {
                        temp1[0].label = thismonth.toDateString().substring(4, 7) + " " + array2[i][0] + " - " + array2[i][1]
                        temp1[0].count = temp1[0].count || 0
                    } else {
                        temp1.push({
                            label: thismonth.toDateString().substring(4, 7) + " " + array2[i][0] + " - " + array2[i][1],
                            count: 0
                        })
                    }
                    data.push(temp1[0])
                }
                res.send({
                    Status: "done",
                    data: data
                })
            } else if (req.body.type == 'Year') {
                var data = []
                for (let i = 0; i < sqlarr.length; i++) {
                    const element = sqlarr[i];
                    sql = `SELECT ${sqlgroup} as label ,count(${sqlgroup}) as count FROM OrderHistory where email ="${_escpe(req.body.Email)}" ${element.sql} ${shopsql} group by ${sqlgroup} ORDER BY OrderDate ASC`

                    var temp1 = await PromisifiedQuery(sql)
                    if (temp1.length != 0) {
                        temp1[0].label = element.month
                        temp1[0].count = temp1[0].count || 0
                    } else {
                        temp1.push({
                            label: element.month,
                            count: 0
                        })
                    }
                    data.push(temp1[0])
                }
                res.send({
                    Status: "done",
                    data: data
                })
            }

        } else {
            res.send({
                Status: "Licence Not Correct"
            });
        }
    });
});
