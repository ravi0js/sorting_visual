let sortAnimation;

function bubbleSort(array, descending) {
  let len = array.length;
  let i = 0;

  function innerLoop(j) {
    if (j < len - i - 1) {
      if (array[j] > array[j + 1] === !descending) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        animateChartUpdate(array, j, j + 1).then(() => innerLoop(j + 1));
      } else {
        innerLoop(j + 1);
      }
    } else {
      if (i < len - 1) {
        i++;
        outerLoop();
      }
    }
  }

  function outerLoop() {
    innerLoop(0);
  }

  outerLoop();
}

function insertionSort(array, descending) {
  let i = 1;

  function outerLoop() {
    if (i < array.length) {
      let key = array[i];
      let j = i - 1;

      function innerLoop() {
        if (j >= 0 && array[j] > key === !descending) {
          array[j + 1] = array[j];
          j--;
          animateChartUpdate(array, j + 1, j + 2).then(innerLoop);
        } else {
          array[j + 1] = key;
          animateChartUpdate(array, j + 1, j + 1).then(() => {
            i++;
            outerLoop();
          });
        }
      }

      innerLoop();
    }
  }

  outerLoop();
}

function selectionSort(array, descending) {
  let i = 0;

  function outerLoop() {
    if (i < array.length - 1) {
      let minIndex = i;

      function innerLoop(j) {
        if (j < array.length) {
          if (array[j] < array[minIndex] === !descending) {
            minIndex = j;
          }
          animateChartUpdate(array, j, minIndex).then(() => innerLoop(j + 1));
        } else {
          [array[i], array[minIndex]] = [array[minIndex], array[i]];
          animateChartUpdate(array, i, minIndex).then(() => {
            i++;
            outerLoop();
          });
        }
      }

      innerLoop(i + 1);
    }
  }

  outerLoop();
}

async function quickSort(array, left, right, descending) {
  if (left < right) {
    let pivotIndex = await partition(array, left, right, descending);
    await Promise.all([
      quickSort(array, left, pivotIndex - 1, descending),
      quickSort(array, pivotIndex + 1, right, descending),
    ]);
  }
}

async function partition(array, left, right, descending) {
  let pivot = array[right];
  let i = left - 1;
  for (let j = left; j < right; j++) {
    if (array[j] < pivot === !descending) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      await animateChartUpdate(array, i, j);
    }
  }
  [array[i + 1], array[right]] = [array[right], array[i + 1]];
  await animateChartUpdate(array, i + 1, right);
  return i + 1;
}

async function mergeSort(array, left, right, descending) {
  if (left < right) {
    let mid = Math.floor((left + right) / 2);
    await mergeSort(array, left, mid, descending);
    await mergeSort(array, mid + 1, right, descending);
    await merge(array, left, mid, right, descending);
  }
}

async function merge(array, left, mid, right, descending) {
  let n1 = mid - left + 1;
  let n2 = right - mid;
  let L = array.slice(left, mid + 1);
  let R = array.slice(mid + 1, right + 1);

  let i = 0,
    j = 0,
    k = left;
  while (i < n1 && j < n2) {
    if (L[i] <= R[j] === !descending) {
      array[k] = L[i];
      i++;
    } else {
      array[k] = R[j];
      j++;
    }
    await animateChartUpdate(array, k, k);
    k++;
  }

  while (i < n1) {
    array[k] = L[i];
    await animateChartUpdate(array, k, k);
    i++;
    k++;
  }

  while (j < n2) {
    array[k] = R[j];
    await animateChartUpdate(array, k, k);
    j++;
    k++;
  }
}

async function countSort(array, descending) {
  let max = Math.max(...array);
  let min = Math.min(...array);
  let range = max - min + 1;
  let count = Array(range).fill(0);
  let output = Array(array.length).fill(0);

  for (let i = 0; i < array.length; i++) {
    count[array[i] - min]++;
  }

  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }

  for (let i = array.length - 1; i >= 0; i--) {
    output[count[array[i] - min] - 1] = array[i];
    count[array[i] - min]--;
  }

  for (let i = 0; i < array.length; i++) {
    array[i] = output[i];
    await animateChartUpdate(array, i, i);
  }

  if (descending) array.reverse();
}

async function bucketSort(array, descending) {
  if (array.length === 0) return;

  let i,
    minValue = array[0],
    maxValue = array[0],
    bucketSize = 5;
  array.forEach((currentVal) => {
    if (currentVal < minValue) minValue = currentVal;
    else if (currentVal > maxValue) maxValue = currentVal;
  });

  let bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1;
  let allBuckets = new Array(bucketCount);

  for (i = 0; i < allBuckets.length; i++) {
    allBuckets[i] = [];
  }

  array.forEach((currentVal) => {
    allBuckets[Math.floor((currentVal - minValue) / bucketSize)].push(
      currentVal
    );
  });

  array.length = 0;

  for (i = 0; i < allBuckets.length; i++) {
    insertionSort(allBuckets[i], false);
    allBuckets[i].forEach((element) => {
      array.push(element);
    });
  }

  for (i = 0; i < array.length; i++) {
    await animateChartUpdate(array, i, i);
  }

  if (descending) array.reverse();
}

async function combSort(array, descending) {
  let gap = array.length;
  let shrink = 1.3;
  let sorted = false;

  while (!sorted) {
    gap = Math.floor(gap / shrink);
    if (gap <= 1) {
      gap = 1;
      sorted = true;
    }

    for (let i = 0; i + gap < array.length; i++) {
      if (array[i] > array[i + gap] === !descending) {
        [array[i], array[i + gap]] = [array[i + gap], array[i]];
        await animateChartUpdate(array, i, i + gap);
        sorted = false;
      }
    }
  }
}

async function heapSort(array, descending) {
  let len = array.length;

  for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
    await heapify(array, len, i, descending);
  }

  for (let i = len - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    await animateChartUpdate(array, 0, i);
    await heapify(array, i, 0, descending);
  }

  if (descending) array.reverse();
}

async function heapify(array, n, i, descending) {
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;

  if ((left < n && array[left] > array[largest]) === !descending) {
    largest = left;
  }

  if ((right < n && array[right] > array[largest]) === !descending) {
    largest = right;
  }

  if (largest !== i) {
    [array[i], array[largest]] = [array[largest], array[i]];
    await animateChartUpdate(array, i, largest);
    await heapify(array, n, largest, descending);
  }
}

async function radixSort(array, descending) {
  let max = Math.max(...array);
  let exp = 1;

  while (Math.floor(max / exp) > 0) {
    await countSortByDigit(array, exp, descending);
    exp *= 10;
  }

  if (descending) array.reverse();
}

async function countSortByDigit(array, exp, descending) {
  let output = Array(array.length).fill(0);
  let count = Array(10).fill(0);

  for (let i = 0; i < array.length; i++) {
    let digit = Math.floor(array[i] / exp) % 10;
    count[digit]++;
  }

  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  for (let i = array.length - 1; i >= 0; i--) {
    let digit = Math.floor(array[i] / exp) % 10;
    output[count[digit] - 1] = array[i];
    count[digit]--;
  }

  for (let i = 0; i < array.length; i++) {
    array[i] = output[i];
    await animateChartUpdate(array, i, i);
  }
}

async function shellSort(array, descending) {
  let n = array.length;
  let gap = Math.floor(n / 2);

  while (gap > 0) {
    for (let i = gap; i < n; i++) {
      let temp = array[i];
      let j;

      for (j = i; j >= gap && array[j - gap] > temp === !descending; j -= gap) {
        array[j] = array[j - gap];
        await animateChartUpdate(array, j, j - gap);
      }

      array[j] = temp;
      await animateChartUpdate(array, j, j);
    }

    gap = Math.floor(gap / 2);
  }
}

function animateChartUpdate(array, currentIndex, nextIndex) {
  return new Promise((resolve) => {
    if (sortAnimation) sortAnimation.pause();

    const backgroundColors = array.map((_, index) => {
      if (index === currentIndex) return "rgba(255, 99, 132, 0.2)";
      if (index === nextIndex) return "rgba(54, 162, 235, 0.2)";
      return "rgba(75, 192, 192, 0.2)";
    });

    sortAnimation = anime({
      targets: chart.data.datasets[0].data,
      value: function (el, i) {
        return array[i];
      },
      round: 1,
      easing: "easeInOutQuad",
      duration: 500,
      update: function () {
        chart.data.datasets[0].backgroundColor = backgroundColors;
        chart.update();
      },
      complete: resolve,
    });
  });
}
