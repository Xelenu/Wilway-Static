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

    const allBoxes = document.querySelectorAll('.box');
    allBoxes.forEach(box => {
      if (!box.hasChildNodes() || box.children.length === 0) {
        box.textContent = "Soon!";
      }
    });
