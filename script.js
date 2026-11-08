$(function () {
  "use strict";

  var MAX_DIGIT = 12;
  var SYMBOL = { "+": "+", "-": "−", "*": "×", "/": "÷" };
  var state = createState();
  var stepCount = 0;
  var soundEnabled = true;
  var lastCalc = null;

  var AudioCtx = window.AudioContext || window.webkitAudioContext;
  var audioCtx = AudioCtx ? new AudioCtx() : null;

  function createState() {
    return { current: "0", previous: null, operator: null, overwrite: false };
  }

  function playSound(type) {
    if (!soundEnabled || !audioCtx) return;
    try {
      if (audioCtx.state === "suspended") audioCtx.resume();
      var now = audioCtx.currentTime;
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = type === "print" ? "sawtooth" : "triangle";
      osc.frequency.setValueAtTime(type === "print" ? 180 : 440, now);
      if (type === "print") osc.frequency.exponentialRampToValueAtTime(65, now + 0.06);
      gain.gain.setValueAtTime(type === "print" ? 0.1 : 0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (type === "print" ? 0.065 : 0.025));
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    } catch (e) {}
  }

  function formatNumber(val) {
    if (val === "Error") return "Error";
    var parts = String(val).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  function render() {
    $("#result").text(formatNumber(state.current));
    $("#expr").text(state.previous !== null ? formatNumber(state.previous) + " " + SYMBOL[state.operator] : "");
    $("#stepCounter").text(String(stepCount).padStart(3, "0"));
    $(".key.op").removeClass("active");
    if (state.operator && state.overwrite) {
      $('.key.op[data-op="' + state.operator + '"]').addClass("active");
    }
  }

  function shake() {
    var $d = $("#display").removeClass("shake");
    void $d[0].offsetWidth;
    $d.addClass("shake");
  }

  function bumpPaper() {
    var $s = $("#paperSheet").removeClass("paper-bump");
    void $s[0].offsetWidth;
    $s.addClass("paper-bump");
    $("#receipt").scrollTop($("#receipt")[0].scrollHeight);
  }

  function printLine(label, rawVal, sym, opts) {
    opts = opts || {};
    playSound("print");
    $("#receipt .empty").remove();

    if (opts.isTotal) $('<div class="tape-sep">----------------</div>').appendTo("#receipt");

    var isRed = (String(rawVal).charAt(0) === "-" || opts.isRed) && !opts.isTotal;
    var $entry = $('<div class="entry" tabindex="0"></div>')
      .attr("data-res", rawVal)
      .toggleClass("is-total", !!opts.isTotal)
      .toggleClass("ink-red", isRed)
      .append($('<span class="e-step"></span>').text(label))
      .append($('<span class="e-val"></span>').text(formatNumber(rawVal)))
      .append($('<span class="e-sym"></span>').text(sym))
      .hide();

    $("#receipt").append($entry);
    $entry.slideDown(140, bumpPaper);
  }

  function compute(a, b, op) {
    a = parseFloat(a);
    b = parseFloat(b);
    if (op === "+") return String(parseFloat((a + b).toFixed(10)));
    if (op === "-") return String(parseFloat((a - b).toFixed(10)));
    if (op === "*") return String(parseFloat((a * b).toFixed(10)));
    if (op === "/") return b === 0 ? "Error" : String(parseFloat((a / b).toFixed(10)));
  }

  function inputNumber(digits) {
    playSound("click");
    if (state.current === "Error") state = createState();
    var len = state.current.replace(/[-.]/g, "").length;

    if (state.overwrite || state.current === "0") {
      state.current = (digits === "00" || digits === "0") ? "0" : digits;
      state.overwrite = false;
    } else if (len + digits.length <= MAX_DIGIT) {
      state.current += digits;
    }
    render();
  }

  function inputDot() {
    playSound("click");
    if (state.current === "Error") state = createState();
    if (state.overwrite) { state.current = "0"; state.overwrite = false; }
    if (state.current.indexOf(".") === -1) state.current += ".";
    render();
  }

  function chooseOperator(op) {
    if (state.current === "Error") state = createState();

    if (state.operator && state.overwrite) {
      state.operator = op;
      $("#receipt .entry:last .e-sym").text(SYMBOL[op]);
      playSound("click");
      render();
      return;
    }

    if (state.operator && !state.overwrite) {
      var prevOp = state.operator;
      stepCount++;
      printLine("#" + String(stepCount).padStart(2, "0"), state.current, SYMBOL[op], { isRed: prevOp === "-" });
      state.current = compute(state.previous, state.current, prevOp);
      if (state.current === "Error") {
        printLine("ERR", "Error", "!", { isRed: true });
        state.previous = null;
        state.operator = null;
        shake();
        render();
        return;
      }
    } else {
      stepCount++;
      printLine("#" + String(stepCount).padStart(2, "0"), state.current, SYMBOL[op]);
    }

    state.previous = state.current;
    state.operator = op;
    state.overwrite = true;
    render();
  }

  function equals() {
    if (!state.operator || state.overwrite) return;
    var a = state.previous, b = state.current, o = state.operator;
    var expr = formatNumber(a) + " " + SYMBOL[o] + " " + formatNumber(b);

    stepCount++;
    printLine("#" + String(stepCount).padStart(2, "0"), b, "=", { isRed: o === "-" });

    state.current = compute(a, b, o);
    state.previous = null;
    state.operator = null;
    state.overwrite = true;

    if (state.current === "Error") {
      printLine("ERR", "Error", "!", { isRed: true });
      shake();
    } else {
      lastCalc = { a: a, b: b, op: o, result: state.current };
      printLine("TOT", state.current, "*", { isTotal: true });
    }
    render();
    $("#expr").text(expr + " =");
  }

  function clearEntry() { playSound("click"); state.current = "0"; render(); }
  function clearAll() { state = createState(); stepCount = 0; printLine("CLR", "0", "C"); render(); }

  function backspace() {
    playSound("click");
    if (state.overwrite || state.current === "Error") return;
    state.current = state.current.length > 1 ? state.current.slice(0, -1) : "0";
    if (state.current === "-") state.current = "0";
    render();
  }

  function toggleSign() {
    playSound("click");
    if (state.current === "0" || state.current === "Error") return;
    state.current = state.current.charAt(0) === "-" ? state.current.slice(1) : "-" + state.current;
    render();
  }

  $(".key, .mini-key").on("click", function (e) {
    var $k = $(this);
    if ($k.hasClass("key")) {
      var off = $k.offset(), s = Math.max($k.outerWidth(), $k.outerHeight());
      $('<span class="ripple"></span>').css({
        width: s, height: s,
        left: (e.pageX || off.left + s / 2) - off.left - s / 2,
        top: (e.pageY || off.top + s / 2) - off.top - s / 2
      }).appendTo($k).on("animationend", function () { $(this).remove(); });
    }

    if ($k.attr("data-num") !== undefined) return inputNumber($k.attr("data-num"));
    if ($k.data("op")) return chooseOperator($k.data("op"));

    var act = $k.data("action");
    if (act === "dot") inputDot();
    else if (act === "equals") equals();
    else if (act === "ce") clearEntry();
    else if (act === "clear") clearAll();
    else if (act === "back") backspace();
    else if (act === "sign") toggleSign();
  });

  $("#btnFeed").on("click", function () {
    playSound("print");
    $("#receipt .empty").remove();
    $('<div class="tape-feed-space"></div>').appendTo("#receipt");
    bumpPaper();
  });

  $("#btnReprint").on("click", function () {
    if (!lastCalc) return shake();
    printLine("RPT", lastCalc.a, SYMBOL[lastCalc.op]);
    printLine("RPT", lastCalc.b, "=", { isRed: lastCalc.op === "-" });
    printLine("TOT", lastCalc.result, "*", { isTotal: true });
  });

  $("#clearHistory").on("click", function () {
    playSound("print");
    $("#paperSheet").addClass("paper-tearing");
    setTimeout(function () {
      stepCount = 0;
      $("#receipt").html('<div class="empty">Kertas baru siap...</div>');
      $("#paperSheet").removeClass("paper-tearing");
      render();
      bumpPaper();
    }, 400);
  });

  $("#btnSound").on("click", function () {
    soundEnabled = !soundEnabled;
    $(this).toggleClass("muted", !soundEnabled).text(soundEnabled ? "🔊 SFX" : "🔇 OFF");
  });

  $("#theme").on("click", function () {
    var next = ($("html").attr("data-theme") || "matte") === "matte" ? "glass" : "matte";
    $("html").attr("data-theme", next);
    $(this).text(next === "glass" ? "◐ MATTE" : "◐ GLASS");
  });

  $("#receipt").on("click", ".entry", function () {
    var res = $(this).attr("data-res");
    if (!res || res === "Error") return;
    playSound("click");
    state.current = String(res);
    state.overwrite = true;
    render();
  });

  $(document).on("keydown", function (e) {
    if ($(e.target).is(".entry, button") && e.key === "Enter") return;
    var k = e.key;
    if (/^[0-9]$/.test(k)) inputNumber(k);
    else if (k === ".") inputDot();
    else if ("+-*/".indexOf(k) !== -1) { e.preventDefault(); chooseOperator(k); }
    else if (k === "Enter" || k === "=") { e.preventDefault(); equals(); }
    else if (k === "Backspace") backspace();
    else if (k === "Delete") clearEntry();
    else if (k === "Escape") clearAll();
  });

  render();
});
