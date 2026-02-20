/* OnRecord Title — Calculator Logic */

function parseNum(str) {
  if (!str) return 0;
  return parseFloat(str.replace(/[^0-9.\-]/g, '')) || 0;
}
function fmt(n) {
  return '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtSigned(n) {
  var prefix = n < 0 ? '-' : '';
  return prefix + fmt(n);
}

/* Utah title insurance rate schedule (approximate ALTA rates)
   These are simplified residential rates for estimation purposes */
function calcOwnerPolicy(value) {
  if (value <= 0) return 0;
  // Utah basic rate schedule approximation
  if (value <= 50000) return value * 0.00575;
  if (value <= 100000) return 287.50 + (value - 50000) * 0.005;
  if (value <= 500000) return 537.50 + (value - 100000) * 0.004;
  if (value <= 1000000) return 2137.50 + (value - 500000) * 0.003;
  return 3637.50 + (value - 1000000) * 0.002;
}

function calcLenderPolicy(loanAmt) {
  if (loanAmt <= 0) return 0;
  // Simultaneous issue discount (typically ~40% of owner rate)
  return calcOwnerPolicy(loanAmt) * 0.4;
}

/* ---- Seller Net Sheet ---- */
(function () {
  var form = document.getElementById('netSheetForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var sale = parseNum(document.getElementById('salePrice').value);
    var mortgage = parseNum(document.getElementById('mortgageBalance').value);
    var commPct = parseNum(document.getElementById('agentCommission').value) / 100;
    var concessions = parseNum(document.getElementById('sellerConcessions').value);

    if (sale <= 0) { document.getElementById('salePrice').focus(); return; }

    var commission = sale * commPct;
    var titleIns = calcOwnerPolicy(sale);
    var escrow = 450; // typical Utah escrow fee
    var recording = 75;
    var taxProration = sale * 0.006 * 0.5; // ~0.6% annual rate, half year estimate

    var totalCosts = mortgage + commission + titleIns + escrow + recording + taxProration + concessions;
    var net = sale - totalCosts;

    document.getElementById('resPrice').textContent = fmt(sale);
    document.getElementById('resMortgage').textContent = '-' + fmt(mortgage);
    document.getElementById('resCommission').textContent = '-' + fmt(commission);
    document.getElementById('resTitleIns').textContent = '-' + fmt(titleIns);
    document.getElementById('resEscrow').textContent = '-' + fmt(escrow);
    document.getElementById('resRecording').textContent = '-' + fmt(recording);
    document.getElementById('resTax').textContent = '-' + fmt(taxProration);
    document.getElementById('resConcessions').textContent = concessions > 0 ? '-' + fmt(concessions) : fmt(0);

    var netEl = document.getElementById('resNet');
    netEl.textContent = fmtSigned(net);
    netEl.className = net >= 0 ? 'positive' : 'negative';

    document.getElementById('netSheetResults').style.display = 'block';
    document.getElementById('netSheetResults').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
})();

/* ---- Rate Quote ---- */
(function () {
  var form = document.getElementById('rateQuoteForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var propValue = parseNum(document.getElementById('propertyValue').value);
    var loanAmt = parseNum(document.getElementById('loanAmount').value);
    var txType = document.getElementById('transactionType').value;

    if (propValue <= 0) { document.getElementById('propertyValue').focus(); return; }

    var ownerPremium = txType === 'refinance' ? 0 : calcOwnerPolicy(propValue);
    var lenderPremium = loanAmt > 0 ? calcLenderPolicy(loanAmt) : 0;
    var searchFee = 250;
    var escrowFee = 450;
    var total = ownerPremium + lenderPremium + searchFee + escrowFee;

    document.getElementById('resOwner').textContent = txType === 'refinance' ? 'N/A (Refinance)' : fmt(ownerPremium);
    document.getElementById('resLender').textContent = loanAmt > 0 ? fmt(lenderPremium) : 'N/A';
    document.getElementById('resSearch').textContent = fmt(searchFee);
    document.getElementById('resEscrowFee').textContent = fmt(escrowFee);
    document.getElementById('resTotal').textContent = fmt(total);

    document.getElementById('lenderRow').style.display = loanAmt > 0 ? 'flex' : 'none';
    document.getElementById('rateResults').style.display = 'block';
    document.getElementById('rateResults').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
})();
