var p = [];

// 新增变量存储当前显示列表，初始为完整列表
var currentList = p.slice();
// 分页相关变量
var currentPage = 1;
var pageSize = 3;

// 显示当前页数据
function showPerson(list) {
    if (list && Array.isArray(list)) {
        currentList = list.slice();
        currentPage = 1;
    } else if (!list) {
        currentList = p.slice();
        currentPage = 1;
    }
    renderPage();
}

function renderPage() {
    var table1 = document.getElementById("table1");
    var start = (currentPage - 1) * pageSize;
    var end = start + pageSize;
    var pageData = currentList.slice(start, end);

    var str = "<tr><th>编号</th><th>头像</th><th>姓名</th><th>性别</th><th>年龄</th><th>籍贯</th><th>邮件</th><th>部门</th><th>操作</th></tr>";
    for (var i = 0; i < pageData.length; i++) {
        var a = pageData[i];
        str += "<tr>" +
            "<td>" + (start + i + 1) + "</td>" +
            "<td><img src='" + a.photo + "' width='50'></td>" +
            "<td>" + a.name + "</td>" +
            "<td>" + a.sex + "</td>" +
            "<td>" + a.age + "</td>" +
            "<td>" + a.area + "</td>" +
            "<td>" + (a.email || "") + "</td>" +
            "<td>" + (a.department || "") + "</td>" +
            "<td><button type='button' class='btn btn-success' onclick='showUpdatePerson(" + a.id + ")'>修改</button> &nbsp;&nbsp;<button type='button' class='btn btn-danger' onclick='deletePerson(" + a.id + ")'>删除</button></td>" +
            "</tr>";
    }
    table1.innerHTML = str;

    var totalPages = Math.ceil(currentList.length / pageSize);
    document.getElementById("pageInfo").textContent = "第 " + currentPage + " 页 / 共 " + totalPages + " 页";

    document.querySelector("#paginationControls button:nth-child(1)").disabled = (currentPage === 1);
    document.querySelector("#paginationControls button:nth-child(3)").disabled = (currentPage === totalPages);
}

function nextPage() {
    var totalPages = Math.ceil(p.length / pageSize);
    if (currentPage < totalPages) {
        currentPage++;
        renderPage();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderPage();
    }
}

// 页面加载后初始化显示第一页
window.onload = function () {
    showPerson(p);
};


// 显示新增人员信息
function showAddPerson() {
    var div3 = document.getElementById("div3");
    div3.style = "display: none;";
    var div2 = document.getElementById("div2");
    div2.style = "margin: 2.25rem;";
}

// 新增人员信息
function addPerson() {
    var a = {};
    a.name = document.getElementById("name").value;
    a.age = document.getElementById("age").value;
    a.sex = document.getElementById("sex").value;
    a.area = document.getElementById("area").value;
    a.email = document.getElementById("email").value;
    a.department = document.getElementById("department").value;

    // 头像改为上传后返回url，简化起见这里先用默认图片
    a.photo = "/imgs/img.jpg";

    if (a.name == "" || a.age == "" || a.sex == "" || a.area == "" || a.email == "" || a.department == "") {
        Swal.fire({
            icon: 'warning',
            title: '提示',
            text: '请填写完整信息'
        });

        return;
    }

    fetch('http://localhost:2077/persons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(a)
    })
        .then(res => res.json())
        .then(data => {
            console.log("新增成功，id=", data.id);
            fetchPersons();  // 重新拉取列表刷新页面
        })
        .catch(err => console.error("新增失败", err));
}

// 根据id删除人员信息
function deletePerson(id) {
    Swal.fire({
        title: '确定删除？',
        text: "删除后数据无法恢复！",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: '是的，删除！',
        cancelButtonText: '取消'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`http://localhost:2077/persons/${id}`, { method: 'DELETE' })
                .then(res => res.json())
                .then(data => {
                    console.log("删除成功", data);
                    Swal.fire('已删除！', '人员信息已被删除。', 'success');
                    fetchPersons();
                })
                .catch(err => {
                    console.error("删除失败", err);
                    Swal.fire('错误', '删除失败，请检查控制台。', 'error');
                });
        }
    });

}


// 根据id修改人员信息
function showUpdatePerson(id) {

    // 向后端请求该 id 的人员信息
    fetch(`http://localhost:2077/persons/${id}`)
        .then(res => {
            if (!res.ok) throw new Error("无法获取人员信息");
            return res.json();
        })
        .then(person => {
            // 填充表单字段
            document.getElementById("uname").value = person.name;
            document.getElementById("uage").value = person.age;
            document.getElementById("usex").value = person.sex;
            document.getElementById("uarea").value = person.area;
            document.getElementById("uemail").value = person.email;
            document.getElementById("udepartment").value = person.department;
            document.getElementById("uid").value = person.id;
            document.getElementById("prevPhoto").src = person.photo || "/imgs/img.jpg";

            // 隐藏列表，显示编辑表单
            document.getElementById("div2").style.display = "none";
            const div3 = document.getElementById("div3");
            div3.style.display = "block";
            div3.style.margin = "2.25rem";
        })
        .catch(err => {
            console.error("加载人员信息失败：", err);
            Swal.fire({
                icon: 'error',
                title: '错误',
                text: '加载人员信息失败，请检查网络或后端服务。'
            });

        });

    //TODO:Base64编码与解码头像上传预览模式
    // 监听头像上传预览
    // document.getElementById("uphoto").addEventListener("change", function (e) {
    //     var file = e.target.files[0];
    //     if (file) {
    //         var url = URL.createObjectURL(file);
    //         document.getElementById("prevPhoto").src = url;
    //     }
    // });
    document.getElementById("uphoto").addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 200 * 1024) {
            Swal.fire({
                icon: 'error',
                title: '文件过大',
                text: '请上传小于 200KB 的头像'
            });
            e.target.value = ''; // 清除文件选择
            return;
        }

        const reader = new FileReader();
        reader.onload = function () {
            const base64Str = reader.result;
            document.getElementById("prevPhoto").src = base64Str;
            // 把 base64 存储到一个隐藏字段或变量中，用于提交
            document.getElementById("photoBase64").value = base64Str;
        };
        reader.readAsDataURL(file);
    });

}

// 修改人员信息
function updatePerson() {
    var id = document.getElementById("uid").value;
    var a = {
        name: document.getElementById("uname").value,
        age: document.getElementById("uage").value,
        sex: document.getElementById("usex").value,
        area: document.getElementById("uarea").value,
        email: document.getElementById("uemail").value,
        department: document.getElementById("udepartment").value,
        // photo: document.getElementById("prevPhoto").src || "/res/img.jpg"
        photo: document.getElementById("photoBase64").value || "/imgs/img.jpg"

    };

    fetch(`http://localhost:2077/persons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(a)
    })
        .then(res => res.json())
        .then(data => {
            console.log("修改成功", data);
            fetchPersons();
            document.getElementById("div3").style = "display: none;";
        })
        .catch(err => console.error("修改失败", err));
}

// 搜索人员信息
function searchPerson() {
    const keyword = document.getElementById("searchInput").value.trim();
    console.log("搜索关键字:", keyword);

    let url = "http://localhost:2077/persons";
    if (keyword !== "") {
        url += `?keyword=${encodeURIComponent(keyword)}`;
    }

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error("搜索失败");
            return res.json();
        })
        .then(data => {
            console.log("搜索结果:", data);
            showPerson(data); // 渲染搜索结果
        })
        .catch(err => {
            console.error("搜索出错:", err);
            Swal.fire({
                icon: 'error',
                title: '搜索失败',
                text: '请检查控制台获取更多信息。'
            });

        });
}

//TODO:
// 下面的导入导出XML功能保持不变，需根据需求可考虑加email和department字段导入导出
// 这里也顺便修改了XML导入导出函数，添加了email和department字段支持
function importXmlFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function () {
        const xmlStr = reader.result;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlStr, "application/xml");
        const persons = xmlDoc.getElementsByTagName("person");

        const promises = [];

        for (let i = 0; i < persons.length; i++) {
            const person = persons[i];
            const personData = {
                name: person.getElementsByTagName("name")[0]?.textContent || "",
                age: parseInt(person.getElementsByTagName("age")[0]?.textContent || "0"),
                sex: person.getElementsByTagName("sex")[0]?.textContent || "",
                area: person.getElementsByTagName("area")[0]?.textContent || "",
                email: person.getElementsByTagName("email")[0]?.textContent || "",
                department: person.getElementsByTagName("department")[0]?.textContent || "",
                photo: "/imgs/img.jpg" // 默认头像
            };

            // 发送 POST 请求导入到数据库
            const promise = fetch('http://localhost:2077/persons', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(personData)
            }).then(res => {
                if (!res.ok) {
                    throw new Error("导入失败: " + res.statusText);
                }
                return res.json();
            });

            promises.push(promise);
        }

        // 等所有数据插入完毕后刷新人员列表
        Promise.all(promises)
            .then(() => {
                Swal.fire('成功', 'XML 数据导入成功！', 'success');
                showPerson(); // 刷新人员展示
            })
            .catch(err => {
                console.error("导入出错:", err);
                Swal.fire('错误', '部分或全部人员导入失败，请检查控制台日志。', 'error');
            });
    };
    reader.readAsText(file);
}


function exportXmlFile() {
    const doc = document.implementation.createDocument("", "", null);
    const root = doc.createElement("persons");

    for (let i = 0; i < p.length; i++) {
        const a = p[i];
        const person = doc.createElement("person");

        const name = doc.createElement("name");
        name.textContent = a.name;
        person.appendChild(name);

        const age = doc.createElement("age");
        age.textContent = a.age;
        person.appendChild(age);

        const sex = doc.createElement("sex");
        sex.textContent = a.sex;
        person.appendChild(sex);

        const area = doc.createElement("area");
        area.textContent = a.area;
        person.appendChild(area);

        const email = doc.createElement("email");
        email.textContent = a.email;
        person.appendChild(email);

        const department = doc.createElement("department");
        department.textContent = a.department;
        person.appendChild(department);

        root.appendChild(person);
    }

    doc.appendChild(root);
    const serializer = new XMLSerializer();
    const xmlStr = serializer.serializeToString(doc);

    const blob = new Blob([xmlStr], { type: "application/xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "人员信息.xml";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


// 取消按钮，隐藏表单
function cancel() {
    //隐藏新增人员信息界面
    var div2 = document.getElementById("div2");
    div2.style = "display: none;";
    //隐藏修改人员信息界面
    var div3 = document.getElementById("div3");
    div3.style = "display: none;";
}

function fetchPersons() {
    fetch('http://localhost:2077/persons')
        .then(res => res.json())
        .then(data => {
            p = data;      // 把从数据库获取的人员列表赋值给p
            showPerson(p); // 显示第一页数据
        })
        .catch(err => {
            console.error("获取人员数据失败", err);
        });
}

window.onload = function () {
    fetchPersons();
};