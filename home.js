
function inputPara() {
    var input = document.getElementById("textarea-input").value;
    document.getElementById("textarea-output").value = "";

    $.ajax({
        type: "GET",
        url: "https://fe3defc7.ngrok.io",
        contentType: 'charset=utf-8',
        data: input,
        crossDomain: true,
        success: function (content) {
            document.getElementById("textarea-output").value = content;
        }
    })

    // code bug day minh thay trong gon gon thi post thoi :))
}