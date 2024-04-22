'use strict';

/* OTP input */
document.addEventListener("DOMContentLoaded", function () {
    var otpInputs = document.querySelectorAll(".otp-input");

    function setupOtpInputListeners(inputs) {
        inputs.forEach(function (input, index) {
            input.addEventListener("paste", function (ev) {
                var clip = ev.clipboardData.getData('text').trim();
                if (!/^\d{6}$/.test(clip)) {
                    ev.preventDefault();
                    return;
                }

                var characters = clip.split("");
                inputs.forEach(function (otpInput, i) {
                    otpInput.value = characters[i] || "";
                });

                enableNextBox(inputs[0], 0);
                inputs[5].removeAttribute("disabled");
                inputs[5].focus();
                updateOTPValue(inputs);
            });

            input.addEventListener("input", function () {
                var currentIndex = Array.from(inputs).indexOf(this);
                var inputValue = this.value.trim();

                if (!/^\d$/.test(inputValue)) {
                    this.value = "";
                    return;
                }

                if (inputValue && currentIndex < 3) {
                    inputs[currentIndex + 1].removeAttribute("disabled");
                    inputs[currentIndex + 1].focus();
                }

                if (currentIndex === 4 && inputValue) {
                    inputs[5].removeAttribute("disabled");
                    inputs[5].focus();
                }

                updateOTPValue(inputs);
            });

            input.addEventListener("keydown", function (ev) {
                var currentIndex = Array.from(inputs).indexOf(this);

                if (!this.value && ev.key === "Backspace" && currentIndex > 0) {
                    inputs[currentIndex - 1].focus();
                }
            });
        });
    }

    function enableNextBox(input, currentIndex) {
        var inputValue = input.value;

        if (inputValue === "") {
            return;
        }

        var nextIndex = currentIndex + 1;
        var nextBox = otpInputs[nextIndex];

        if (nextBox) {
            nextBox.removeAttribute("disabled");
        }
    }

    function updateOTPValue(inputs) {
        var otpValue = "";

        inputs.forEach(function (input) {
            otpValue += input.value;
        });

        return otpValue;
    }

    setupOtpInputListeners(otpInputs);

    otpInputs[0].focus(); // Set focus on the first OTP input field

    var current_progress = 0;
    var interval = null;

    const showPrintProgress = () => {
        $("#step-4").addClass("fadeDown");
        setTimeout(() => {
            $("#step-3").addClass("d-none");
            $("#step-4").removeClass("d-none");

            interval = setInterval(function () {
                current_progress += 10;
                $("#dynamic")
                    .css("width", current_progress + "%")
                    .attr("aria-valuenow", current_progress);

                $("#current-progress").text(current_progress + "% Complete");
                if (current_progress >= 100) {
                    $("#step-4").addClass("d-none");
                    $("#step-5").removeClass("d-none");
                    clearInterval(interval);
                }
            }, 1000);
        }, 1000);
    }

    otpInputs[3].addEventListener("input", function () {
        let otpValue = updateOTPValue(otpInputs);
        if (otpValue == "8613") {
            showPrintProgress();

            otpInputs.forEach(function (input) {
                input.classList.remove("is-invalid");
            });
        }
        else {
            otpInputs.forEach(function (input) {
                input.classList.add("is-invalid");
            });

            $("#otp-validation").text("لم يتم ادخال رقم التحقق بشكل صحيح");
            $("#otp-validation").addClass("d-block");
        }
    });

});

// OTP Time
let timeCounter = 150;
var refreshIntervalId = null;

const handelTimeCounter = () => {
    let time = document.getElementById("time");

    if (timeCounter > 0) {
        --timeCounter;
        let min = timeCounter / 60;
        let sec = timeCounter % 60;
        time.innerHTML = `${sec >= 10 ? sec : `0${sec}`} : 0${Math.floor(min)}`;
    }
    else {
        $(".re-send-btn").removeClass("d-none");
        clearInterval(refreshIntervalId);
        timeCounter = 150;
    }
}

let id = "221520003";

$(function () {
    setTimeout(() => {
        $(".main-container").addClass("d-none");
        $(".screen-container").removeClass("d-none");
    }, 2000);

    const handelPrintBtn = () => {
        $(".print-btn").addClass("fadeInDown");
        $(".id-card-btn").addClass("fadeInUp");

        setTimeout(() => {
            $(".step-1").addClass("d-none");
            $("#step-2").removeClass("d-none");
            $("#step-2").addClass("fade-right");
        }, 300);
    }

    $(".print-btn").on("click", handelPrintBtn);

    const handelSendRequestBtn = () => {
        let nationalId = $(".national-id-input").val();

        if (nationalId.length == 0) {
            $("#national-id-validation").text("رقم الهوية مطلوب");
            $("#national-id-validation").addClass("d-block");
            $(".national-id-input").addClass("is-invalid");
        }
        else if (nationalId[0] != "2") {
            $("#national-id-validation").text("خطا فى كتابة رقم الهوية لابد من بداية رقم الهوية برقم 2");
            $("#national-id-validation").addClass("d-block");
            $(".national-id-input").addClass("is-invalid");
        }
        else if (nationalId !== id) {
            location.href = `${location.origin}/pages/response_error.html`;
        } else {
            $("#step-2").addClass("fadeUp-left");

            setTimeout(() => {
                $("#step-2").addClass("d-none");
                $("#step-3").removeClass("d-none");
                $("#step-3").addClass("fade-right");
                refreshIntervalId = setInterval(handelTimeCounter, 1000);

            }, 1000);
        }

    }

    $(".send-request-btn").on("click", handelSendRequestBtn);

    const handelBackBtn = () => {
        $("#step-2").addClass("fade-left");

        setTimeout(() => {
            $("#step-2").addClass("d-none");
            $(".step-1").removeClass("d-none");
            $(".print-btn").removeClass("fadeInDown");
            $(".id-card-btn").removeClass("fadeInUp");

            $(".print-btn").addClass("fadeOutUp");
            $(".id-card-btn").addClass("fadeOutDown");
        }, 300);
    }

    $(".back-btn").on("click", handelBackBtn);

    $(".re-send-btn").on("click", () => {
        timeCounter = 150;
        $(".re-send-btn").addClass("d-none");
        refreshIntervalId = setInterval(handelTimeCounter, 1000);
    });
});