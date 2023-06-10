let game = {
  element: {
    boxs: document.querySelectorAll(".container .box"),
    bloodEle: document.querySelector("#blood span"),
    tipEle: document.querySelector(".tip"),
    gameCtl: document.querySelector("#control .btn"),
    gameStep: document.querySelector("#control .ctl-input"),
    gamePath: document.querySelector("#game-path"),
  },
  gameData: {
    step: 0,
    dragonPos: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23,
      24,
    ].filter((i) => Math.random() > 0.8), // 恶龙的位置
    angelPos: 20, // 天使的位置
    randomArr: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24,
    ],
    pathArr: [], // 表示行走的路径数组
    curPos: 0, // 表示当前的位置
    curBlood: 3, // 表示当前的血量
  },
  events: {
    moveHandlerDebounce: null,
  },
  randomNum(start, end) {
    return Math.floor(Math.random() * (end - start + 1)) + start;
  },
  getStep(step) {
    return step ? step : Number(this.randomNum(1, 3));
  },
  // 游戏的所有格子的 data-index 属性按照摆放的位置组成二维数组，起始和最中间的格子单独赋值
  getDyadicArray() {
    const dyadicArray = [];
    let tempArr = [];
    Array.from(this.element.boxs).forEach((box, index) => {
      let i = index % 5;
      tempArr.push(Number(box.dataset.index));
      if (i == 4) {
        dyadicArray.push(tempArr);
        tempArr = [];
      }
    });
    dyadicArray[0][0] = "start";
    dyadicArray[2][2] = "end";
    return dyadicArray;
  },
  // 防抖函数
  debounce(handle, isImmediate = false, wait = 500) {
    let timer = null;
    let isDone;
    return function (...args) {
      let self = this;
      isDone = isImmediate && !timer;
      timer && clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        !isImmediate && handle.apply(self, args);
      }, wait);
      isDone && handle.apply(self, args);
    };
  },
  /**
   * @description 游戏结束提示函数
   * @param {"success" | "warning"} tip "success" 和 "warning"
   * */
  tipRender(tip) {
    const tipEle = this.element.tipEle;
    tipEle.classList.remove("hide");
    tipEle.classList.add("show");
    if (tip === "success") {
      tipEle.style.backgroundColor = "green";
      tipEle.innerText = "营救成功";
    }
    if (tip === "warning") {
      tipEle.style.backgroundColor = "red";
      tipEle.innerText = "重伤不治";
    }
  },
  /**
   * @description 根据传入的元素节点，计算勇士的血量
   * @param {Element} boxEle 传入的元素节点
   * */
  bloodCalculator(boxEle) {
    curBlood = this.gameData.curBlood;
    if (Array.from(boxEle.classList).includes("dragon")) {
      curBlood -= 2;
    }
    if (Array.from(boxEle.classList).includes("angel")) {
      curBlood += 3;
    }
    if (curBlood <= 0) {
      this.tipRender("warning");
      curBlood = 0;
      this.element.gameCtl.removeEventListener(
        "click",
        this.events.moveHandlerDebounce
      );
    }
    this.element.bloodEle.innerText = curBlood;
    this.gameData.curBlood = curBlood;
  },
  /**
   * @description 根据传入的二维数组，得到一维数组
   * @param {Array} arr: getDyadicArray 得到的二维数组，存储地图上每个box的 data-index 值
   * @return {Array} 一维数组，保存经过的路径
   */
  mazePath(arr) {
    // TODO: 得到起点到终点经过的每个 box 元素的 data-index 的值并依次保存在数组中
    const width = arr[0].length;
    const height = arr.length;
    let i = 0, j = 0;
    const directions = ["right", "down", "left", "up"];
    let dir = 0;
    let res = [];
    function getNext(i, j, dir) {
      switch (directions[dir]) {
        case "right":
          j += 1;
          break;
        case "down":
          i += 1;
          break;
        case "left":
          j -= 1;
          break;
        case "up":
          i -= 1;
          break;
      }
      if (i < 0 || i >= height) return false;
      if (j < 0 || j >= width) return false;
      return { i, j, val: arr[i][j] };
    }

    let visited = new Set();

    do {
      res.push(arr[i][j]);
      visited.add(arr[i][j]);
      let next = getNext(i, j, dir);
      if (next === false || visited.has(next.val)) {
        dir += 1;
        dir %= 4;
        next = getNext(i, j, dir)
      }
      i = next.i;
      j = next.j;
    }
    while (arr[i][j] !== "end")
    res.push("end");
    console.log(res);
    return res;
  },
  moveHandler() {
    let step = (this.element.gameStep.value = this.getStep(this.gameData.step));
    // TODO：根据点击营救后获得的点数，正确到达指定位置调用bloodCalculator函数计算当前血量，到达公主处调用 tipRender 函数，每步的时间间隔在 200ms内（大于此时间会导致判题失败）。
    const sleep = (ms) => new Promise(resolve =>
      setTimeout(resolve, ms) // required < 200 ms
    );
    new Promise(async () => {
      let curPos = this.gameData.curPos;
      for (let i = 0; i < step; i++) {
        { // unset current box active
          const curData = this.gameData.pathArr[curPos];
          let curBox;
          for (const box of this.element.boxs) {
            if (box.getAttribute('data-index') === curData.toString()) {
              curBox = box;
              break;
            }
          }
          curBox.classList.remove('active');
        }
        curPos += 1;
        { // set next box active
          const curData = this.gameData.pathArr[curPos];
          let curBox;
          for (const box of this.element.boxs) {
            if (box.getAttribute('data-index') === curData.toString()) {
              curBox = box;
              break;
            }
          }
          curBox.classList.add('active');
          this.bloodCalculator(curBox);
          if (this.gameData.curBlood <= 0) {
            this.tipRender('warning');
            break;
          }
          if (curBox.classList.contains('princess')) {
            this.tipRender('success');
            break;
          }
        }
        this.gameData.curPos = curPos;
        await sleep(100);
      }
    })
  },
  /**
   * @description 初始化游戏界面，将公主，恶龙，天使放入到指定位置，并绑定点击事件
   */
  initPlay() {
    Array.from(this.element.boxs).forEach((box, index, boxs) => {
      if (index === 0) {
        box.innerText = "start";
        box.setAttribute("data-index", "start");
      } else if (index === Math.floor(boxs.length / 2)) {
        box.classList.add("princess");
        box.setAttribute("data-index", "end");
      } else {
        box.setAttribute("data-index", this.gameData.randomArr[index]);
        if (this.gameData.dragonPos.includes(index)) {
          box.classList.add("dragon");
        } else if (index == this.gameData.angelPos) {
          box.classList.add("angel");
        } else {
          box.style.backgroundColor = "#f5f5f5";
          box.innerText = `无危险`;
        }
      }
    });
    this.element.bloodEle.innerText = this.gameData.curBlood;
    this.gameData.pathArr = this.mazePath(this.getDyadicArray());
    this.element.gamePath.innerText = JSON.stringify(this.gameData.pathArr);
    this.events.moveHandlerDebounce = this.debounce(
      this.moveHandler.bind(this)
    );
    this.element.gameCtl.addEventListener(
      "click",
      this.events.moveHandlerDebounce
    );
  },
};
