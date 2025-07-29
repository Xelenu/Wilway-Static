function createBox(row, col, index) {
      const box = document.createElement('div');
      box.classList.add('box');
      box.setAttribute('data-row', row);
      box.setAttribute('data-col', col);
      box.setAttribute('data-index', index);
      box.id = `box-${index}`;
      return box;
    }

    function createGrid(rows, cols) {
      const container = document.getElementById('gridContainer');
      let index = 1;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const box = createBox(row, col, index);
          container.appendChild(box);
          index++;
        }
      }
    }

    createGrid(20, 2);

const siteUrl = window.location.origin;

const specialBox1 = document.getElementById('box-1');
if (specialBox1) {
  specialBox1.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/repo.png" alt="R.E.P.O." draggable="false">
      <p>R.E.P.O. ⭐</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=1'">Let's go!</button>
    </div>
  `;
}

const specialBox2 = document.getElementById('box-2');
if (specialBox2) {
  specialBox2.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/webfishing.png" alt="Webfishing" draggable="false">
      <p>Webfishing</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=2'">Let's go!</button>
    </div>
  `;
}

const specialBox3 = document.getElementById('box-3');
if (specialBox3) {
  specialBox3.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/wolfenstein.png" alt="Wolfenstein" draggable="false">
      <p>Wolfenstein 3D 👀</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=3'">Let's go!</button>
    </div>
  `;
}

const specialBox4 = document.getElementById('box-4');
if (specialBox4) {
  specialBox4.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/bfdi.png" alt="BFDI: Branches (demo)" draggable="false">
      <p>BFDI: Branches (DEMO) ✨</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=4'">Let's go!</button>
    </div>
  `;
}

const specialBox5 = document.getElementById('box-5');
if (specialBox5) {
  specialBox5.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/bfnspue.png" alt="Baldi's Fun New School Plus™ Ultimate Edition" draggable="false">
      <p>Baldi's Fun New School Plus™ Ultimate Edition ⭐ 🤑</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=5'">Let's go!</button>
    </div>
  `;
}

const specialBox6 = document.getElementById('box-6');
if (specialBox6) {
  specialBox6.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/kittytoy.png" alt="KittyToy" draggable="false">
      <p>KittyToy 🤑</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=6'">Let's go!</button>
    </div>
  `;
}

const specialBox7 = document.getElementById('box-7');
if (specialBox7) {
  specialBox7.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/wbwwb.png" alt="WBWWB" draggable="false">
      <p>We Become What We Behold ✍️</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=7'">Let's go!</button>
    </div>
  `;
}

const specialBox8 = document.getElementById('box-8');
if (specialBox8) {
  specialBox8.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/slope.png" alt="Slope" draggable="false">
      <p>Slope</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=8'">Let's go!</button>
    </div>
  `;
}

const specialBox9 = document.getElementById('box-9');
if (specialBox9) {
  specialBox9.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/cross-the-road.png" alt="Cross the Road" draggable="false">
      <p>Cross the Road</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=9'">Let's go!</button>
    </div>
  `;
}

const specialBox10 = document.getElementById('box-10');
if (specialBox10) {
  specialBox10.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/obby-bike.png" alt="Obby Bike" draggable="false">
      <p>Obby Bike</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=10'">Let's go!</button>
    </div>
  `;
}

const specialBox11 = document.getElementById('box-11');
if (specialBox11) {
  specialBox11.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/stickman-survival.png" alt="Stickman Survival" draggable="false">
      <p>Stickman Survival</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=11'">Let's go!</button>
    </div>
  `;
}

const specialBox12 = document.getElementById('box-12');
if (specialBox12) {
  specialBox12.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/eggy-car.png" alt="Eggy Car" draggable="false">
      <p>Eggy Car</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=12'">Let's go!</button>
    </div>
  `;
}

const specialBox13 = document.getElementById('box-13');
if (specialBox13) {
  specialBox13.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/1v1lol.png" alt="1v1.LOL" draggable="false">
      <p>1v1.LOL</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=13'">Let's go!</button>
    </div>
  `;
}

const specialBox14 = document.getElementById('box-14');
if (specialBox14) {
  specialBox14.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/monkeymart.png" alt="Monkeymart" draggable="false">
      <p>Monkeymart</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=14'">Let's go!</button>
    </div>
  `;
}

const specialBox15 = document.getElementById('box-15');
if (specialBox15) {
  specialBox15.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/snowrider-3d.png" alt="Snowrider 3D" draggable="false">
      <p>Snowrider 3D</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=15'">Let's go!</button>
    </div>
  `;
}

const specialBox16 = document.getElementById('box-16');
if (specialBox16) {
  specialBox16.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/ovo.png" alt="OvO" draggable="false">
      <p>OvO</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=16'">Let's go!</button>
    </div>
  `;
}

const specialBox17 = document.getElementById('box-17');
if (specialBox17) {
  specialBox17.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/bitlife.png" alt="BitLife" draggable="false">
      <p>BitLife</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=17'">Let's go!</button>
    </div>
  `;
}

const specialBox18 = document.getElementById('box-18');
if (specialBox18) {
  specialBox18.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/badparenting.png" alt="Bad Parenting" draggable="false">
      <p>Bad Parenting</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=18'">Let's go!</button>
    </div>
  `;
}

const specialBox19 = document.getElementById('box-19');
if (specialBox19) {
  specialBox19.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/bacon-may-die.png" alt="Bacon May Die" draggable="false">
      <p>Bacon May Die</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=19'">Let's go!</button>
    </div>
  `;
}

const specialBox20 = document.getElementById('box-20');
if (specialBox20) {
  specialBox20.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/2048.png" alt="2048" draggable="false">
      <p>2048</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=20'">Let's go!</button>
    </div>
  `;
}

const specialBox21 = document.getElementById('box-21');
if (specialBox21) {
  specialBox21.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/9007199254740992.png" alt="9007199254740992" draggable="false">
      <p>9007199254740992</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=21'">Let's go!</button>
    </div>
  `;
}

const specialBox22 = document.getElementById('box-22');
if (specialBox22) {
  specialBox22.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/rope-police.png" alt="Rope Police" draggable="false">
      <p>Rope Police</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=22'">Let's go!</button>
    </div>
  `;
}

const specialBox23 = document.getElementById('box-23');
if (specialBox23) {
  specialBox23.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/brawl-stars.png" alt="Starr" draggable="false">
      <p>Brawl Stars</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=23'">Let's go!</button>
    </div>
  `;
}

const specialBox24 = document.getElementById('box-24');
if (specialBox24) {
  specialBox24.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/backrooms.png" alt="Backrooms" draggable="false">
      <p>Backrooms</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=24'">Let's go!</button>
    </div>
  `;
}

const specialBox25 = document.getElementById('box-25');
if (specialBox25) {
  specialBox25.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/tboi.png" alt="TBOI" draggable="false">
      <p>The Binding of Isaac</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=25'">Let's go!</button>
    </div>
  `;
}

const specialBox26 = document.getElementById('box-26');
if (specialBox26) {
  specialBox26.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/breaking-the-bank.png" alt="Breaking the Bank" draggable="false">
      <p>Breaking the Bank</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=26'">Let's go!</button>
    </div>
  `;
}

const specialBox27 = document.getElementById('box-27');
if (specialBox27) {
  specialBox27.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/escaping-the-prison.png" alt="Escaping the Prison" draggable="false">
      <p>Escaping the Prison</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=27'">Let's go!</button>
    </div>
  `;
}

const specialBox28 = document.getElementById('box-28');
if (specialBox28) {
  specialBox28.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/stealing-the-diamond.png" alt="Stealing the Diamond" draggable="false">
      <p>Stealing the Diamond</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=28'">Let's go!</button>
    </div>
  `;
}

const specialBox29 = document.getElementById('box-29');
if (specialBox29) {
  specialBox29.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/infiltrating-the-airship.png" alt="Infiltrating the Airship" draggable="false">
      <p>Infiltrating the Airship</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=29'">Let's go!</button>
    </div>
  `;
}

const specialBox30 = document.getElementById('box-30');
if (specialBox30) {
  specialBox30.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/fleeing-the-complex.png" alt="Fleeing the Complex" draggable="false">
      <p>Fleeing the Complex</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=30'">Let's go!</button>
    </div>
  `;
}

const specialBox31 = document.getElementById('box-31');
if (specialBox31) {
  specialBox31.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/gym-simulator.png" alt="GS" draggable="false">
      <p>Gym Simulator 🔥</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=31'">Let's go!</button>
    </div>
  `;
}

const specialBox32 = document.getElementById('box-32');
if (specialBox32) {
  specialBox32.innerHTML = `
    <div class="box-content">
      <img src="${siteUrl}/core/gam-image/fix-the-road.png" alt="Fix the Road" draggable="false">
      <p>Fix the Road</p>
      <button onclick="window.location.href='${siteUrl}/gam/load?id=32'">Let's go!</button>
    </div>
  `;
}




    const allBoxes = document.querySelectorAll('.box');
    allBoxes.forEach(box => {
      if (!box.hasChildNodes() || box.children.length === 0) {
        box.textContent = "Soon!";
      }
    });
