// 获取DOM元素对象
const nickname = document.getElementById("nickname"); //宠物昵称
const addWeight = document.getElementById("addWeight"); // 吃零食按钮
const loseWeight = document.getElementById("loseWeight"); // 跟它玩按钮
const weightEle = document.getElementById("weight"); // 体重
const dress = document.getElementById("dress"); // 穿衣服按钮
const undress = document.getElementById("undress"); // 不穿衣服按钮
const list = document.getElementById("list"); // 行动记录
const vail_name = document.getElementById("vail_name"); // 无昵称提示
const clothes = document.querySelector("input[type=radio]:checked"); // 被选中的 radio
const avatar = document.querySelector(".left"); // 狮子
const love = document.getElementById("love"); // 心情指数元素
let initLove = Number(love.innerText); // 初始化心情指数数字

// 父类狮子
class Lion {
  constructor(weight) {
    this.type = "狮子";
    this.weight = weight;
  }
  // 体重增加
  addWeight() {
    return nickname.value ? ++this.weight : this.weight;
  }
  // 体重减轻
  loseWeight() {
    return nickname.value
      ? this.weight > 30
        ? --this.weight
        : (this.weight = 30)
      : this.weight;
  }
}
// 子类
class MyPet extends Lion {
  constructor(name, weight) {
    super(weight);
    this.name = name;
    this.weight = weight;
    weightEle.innerText = this.weight; // 狮子的体重
    this.logList = []; // 互动日志记录
  }
  // 验证宠物名称，如果存在则把名称赋值给当前实例
  verifyName() {
    // TODO:  待补充代码
    if (nickname.value) {
      this.name = nickname.value;
      vail_name.style.display = "none";
    } else {
      vail_name.style.display = "inline";
    }
  }
  // 穿衣服
  dress(record) {
    if (!this.name) {
      return;
    }
    console.log(this.name);
    undress.classList.remove("active");
    avatar.classList.remove("sk1");
    this.showLog(record);
  }
  // 脱衣服
  undress(record) {
    if (!this.name) {
      return;
    }
    dress.classList.remove("active");
    avatar.classList.add("sk1");
    this.showLog(record);
  }
  // 互动吃零食或者跟他玩
  interact(record) {
    if (!this.name) {
      return;
    }
    this.showLog(record);
  }
  // 记录日志
  showLog(record) {
    // TODO:  待补充代码
    let prevRecords = list.innerText.split('\n');
    if (prevRecords.length >= 10) prevRecords.pop();
    prevRecords = [record, ...prevRecords];
    list.innerText = prevRecords.join('\n');
  }
}

// 实例化一个宠物小狮子
const pet = new MyPet(nickname.value, 60);

let n = 0; // 记录是第几次互动

// 点击穿衣服
dress.onclick = function (e) {
  e.preventDefault();
  pet.verifyName();
  pet.name ? n++ : void 0;
  pet.dress(`第 ${n} 次互动：天气冷了，你给${pet.name}穿了衣服`);
};

// 点击不穿衣服
undress.onclick = function (e) {
  e.preventDefault();
  pet.verifyName();
  pet.name ? n++ : void 0;
  pet.undress(`第 ${n} 次互动：天气热了，你给${pet.name}脱了衣服`);
};

// 吃零食增加当前体重
addWeight.onclick = (e) => {
  e.preventDefault();
  weightEle.innerText = pet.addWeight();
  pet.verifyName();
  pet.name ? n++ : void 0;
  pet.interact(`第 ${n} 次互动：你喂${pet.name}吃了零食，体重 +1kg`);
};

// 跟他玩减轻当前体重
loseWeight.onclick = (e) => {
  e.preventDefault();
  pet.verifyName();
  if (pet.name) {
    n++;
    initLove = initLove + 1;
    love.innerText = initLove;
  }
  pet.interact(`第 ${n} 次互动：${pet.name}跟主人愉快的玩耍，心情指数加1`);
};
