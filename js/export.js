function loadImage(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload  = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

function wrapText(ctx, text, x, y, maxW, lineH, align) {
  const words = text.split(' ');
  let line = '';
  ctx.textAlign = align || 'left';
  words.forEach((word, i) => {
    const test = line + word + ' ';
    if (ctx.measureText(test).width > maxW && i > 0) {
      ctx.fillText(line.trim(), x, y);
      line = word + ' ';
      y += lineH;
    } else {
      line = test;
    }
  });
  ctx.fillText(line.trim(), x, y);
}

async function exportCard() {
  if (!currentPoke) return;
  const btn = document.getElementById('btn-save');
  btn.textContent = '...';
  btn.disabled = true;

  const W = 640, H = 880, M = 48;
  const canvas = document.getElementById('export-canvas');
  canvas.width  = W * 2;
  canvas.height = H * 2;
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2);

  const fb = new FontFace('Bebas Neue', 'url(https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gW7PXooxW5rygbi49c.woff2)');
  const fd = new FontFace('DM Sans',    'url(https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriI5-g4vlH9VoD8Cmcqbu6-K6z9mXgjU0.woff2)');
  await Promise.allSettled([fb.load(), fd.load()]);
  document.fonts.add(fb);
  document.fonts.add(fd);

  const sprite = await loadImage(currentPoke.sprite);
  const { top, worst } = getAffinities(currentPoke);
  const topImgs   = await Promise.all(top.slice(0, 3).map(p => loadImage(p.sprite)));
  const worstImgs = await Promise.all(worst.slice(0, 3).map(p => loadImage(p.sprite)));

  ctx.fillStyle = '#0D0D0D';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  const grad = ctx.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, '#D62828');
  grad.addColorStop(1, '#F77F00');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, 4);

  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '11px "DM Sans"';
  ctx.letterSpacing = '3px';
  ctx.textAlign = 'center';
  ctx.fillText('LE POKÉMON DE', W / 2, 38);

  ctx.fillStyle = '#FCBF49';
  ctx.font = 'bold 44px "Bebas Neue"';
  ctx.letterSpacing = '4px';
  ctx.fillText(currentPseudo.toUpperCase(), W / 2, 78);

  if (sprite) {
    ctx.save();
    ctx.shadowColor = 'rgba(214,40,40,0.4)';
    ctx.shadowBlur  = 40;
    ctx.drawImage(sprite, W / 2 - 100, 90, 200, 200);
    ctx.restore();
  }

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 52px "Bebas Neue"';
  ctx.letterSpacing = '2px';
  ctx.textAlign = 'center';
  ctx.fillText(pokeName(currentPoke).toUpperCase(), W / 2, 320);

  const typeColors = { normal:'#A8A77A',fire:'#EE8130',water:'#6390F0',electric:'#C8A800',grass:'#7AC74C',ice:'#7BBFBA',fighting:'#C22E28',poison:'#A33EA1',ground:'#B89128',flying:'#8B73D4',psychic:'#F95587',bug:'#8B9A10',rock:'#978A20',ghost:'#735797',dragon:'#6F35FC',dark:'#705746',steel:'#8C8CAE',fairy:'#D685AD' };
  const pillW = 80, pillH = 22, pillGap = 10;
  let px = W / 2 - (currentPoke.types.length * pillW + (currentPoke.types.length - 1) * pillGap) / 2;
  currentPoke.types.forEach(t => {
    ctx.fillStyle = typeColors[t] || '#888';
    roundRect(ctx, px, 330, pillW, pillH, 11);
    ctx.fillStyle = '#fff';
    ctx.font = '10px "DM Sans"';
    ctx.letterSpacing = '1px';
    ctx.textAlign = 'center';
    ctx.fillText(typeName(t).toUpperCase(), px + pillW / 2, 345);
    px += pillW + pillGap;
  });

  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.font = '11px "DM Sans"';
  ctx.letterSpacing = '2px';
  ctx.textAlign = 'center';
  ctx.fillText(`${LANG.genLabel} ${currentPoke.gen}  ·  #${currentPoke.id}  ·  BST ${currentPoke.bst}`, W / 2, 374);

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(M, 390); ctx.lineTo(W - M, 390); ctx.stroke();

  ctx.fillStyle = grad;
  ctx.font = '10px "DM Sans"';
  ctx.letterSpacing = '3px';
  ctx.textAlign = 'center';
  ctx.fillText('TON ARCHÉTYPE', W / 2, 414);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 38px "Bebas Neue"';
  ctx.letterSpacing = '3px';
  ctx.fillText(pokeArch(currentPoke).toUpperCase(), W / 2, 450);

  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = 'italic 13px "DM Sans"';
  ctx.letterSpacing = '0px';
  wrapText(ctx, LANG.ARCH_DESC[currentPoke.arch] || '', W / 2, 472, W - 120, 20, 'center');

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath(); ctx.moveTo(M, 524); ctx.lineTo(W - M, 524); ctx.stroke();

  const barX = M + 110 + 8;
  const barW = W - M - 36 - 8 - barX;
  const statLabels = [LANG.puissance, LANG.gabarit, LANG.agres, LANG.vitesse, LANG.solidite];
  const statColors = [['#D62828','#F77F00'],['#003049','#0077B6'],['#9B2226','#D62828'],['#F4A261','#E76F51'],['#6A994E','#A7C957']];

  let sy = 546;
  currentPoke.v.forEach((val, i) => {
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = '10px "DM Sans"';
    ctx.letterSpacing = '1px';
    ctx.textAlign = 'left';
    ctx.fillText(statLabels[i].toUpperCase(), M, sy + 5);

    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    roundRect(ctx, barX, sy - 1, barW, 6, 3);

    const g = ctx.createLinearGradient(barX, 0, barX + barW, 0);
    g.addColorStop(0, statColors[i][0]);
    g.addColorStop(1, statColors[i][1]);
    ctx.fillStyle = g;
    roundRect(ctx, barX, sy - 1, Math.max(4, barW * val / 100), 6, 3);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 11px "Bebas Neue"';
    ctx.letterSpacing = '1px';
    ctx.textAlign = 'right';
    ctx.fillText(val, W - M, sy + 5);
    sy += 26;
  });

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath(); ctx.moveTo(M, sy + 10); ctx.lineTo(W - M, sy + 10); ctx.stroke();
  sy += 28;

  ctx.font = '10px "DM Sans"';
  ctx.letterSpacing = '2px';
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.textAlign = 'left';
  ctx.fillText('ÂMES SŒURS', M, sy);
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.textAlign = 'right';
  ctx.fillText('OPPOSÉS', W - M, sy);
  sy += 14;

  const afSize = 54, afGap = 10;
  topImgs.forEach((img, i) => {
    const ax = M + i * (afSize + afGap);
    if (img) ctx.drawImage(img, ax, sy, afSize, afSize);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = 'bold 8px "Bebas Neue"';
    ctx.letterSpacing = '0.5px';
    ctx.textAlign = 'center';
    ctx.fillText(pokeName(top[i]).toUpperCase(), ax + afSize / 2, sy + afSize + 10);
  });

  worstImgs.forEach((img, i) => {
    const ax = W - M - (i + 1) * (afSize + afGap) + afGap;
    if (img) ctx.drawImage(img, ax, sy, afSize, afSize);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = 'bold 8px "Bebas Neue"';
    ctx.letterSpacing = '0.5px';
    ctx.textAlign = 'center';
    ctx.fillText(pokeName(worst[i]).toUpperCase(), ax + afSize / 2, sy + afSize + 10);
  });

  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.font = '10px "DM Sans"';
  ctx.letterSpacing = '2px';
  ctx.textAlign = 'center';
  ctx.fillText(CONFIG.siteName, W / 2, H - 16);
  ctx.fillStyle = grad;
  ctx.fillRect(0, H - 4, W, 4);

  const link = document.createElement('a');
  link.download = `pokemon-${currentPseudo.toLowerCase()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();

  btn.textContent = LANG.save;
  btn.disabled = false;
}
