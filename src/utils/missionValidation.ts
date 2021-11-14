const oxFlush = (inventory) => {
  var shapecount = new Array(2)
  for (var i = 0; i < 2; i++) {
    shapecount[i] = new Array(4)
  }
  var shape = 'H D C S'
  for (var i = 0; i < 4; i++) {
    shapecount[0][i] = shape.split(' ')[i]
    shapecount[1][i] = 0
  }
  for (var i = 0; i < inventory.length; i++) {
    for (var j = 0; j < 4; j++) {
      if (inventory[i].type.includes(shapecount[0][j])) {
        shapecount[1][j] += inventory[i].quantity
      }
    }
  }
  var ox = false
  for (var i = 0; i < 4; i++) {
    if (shapecount[1][i] >= 5) {
      ox = true
    }
  }
  return ox
}

function repeatcount(inventory) {
  var numbercount = new Array(2)
  for (var i = 0; i < 2; i++) {
    numbercount[i] = new Array(13)
  }
  var number = 'A 2 3 4 5 6 7 8 9 10 J Q K'
  for (var i = 0; i < 13; i++) {
    numbercount[0][i] = number.split(' ')[i]
    numbercount[1][i] = 0
  }
  for (var i = 0; i < inventory.length; i++) {
    for (var j = 0; j < 13; j++) {
      if (inventory[i].type.includes(numbercount[0][j])) {
        numbercount[1][j] += inventory[i].quantity
      }
    }
  }
  return numbercount
}

function paircount(n, m, inventory) {
  var ox = false
  var pair = 0
  for (var i = 0; i < 13; i++) {
    if (repeatcount(inventory)[1][i] >= m) {
      pair += 1
    }
  }
  if (pair >= n) {
    ox = true
  }
  return ox
}

function oxStraignt(inventory) {
  var ox = false
  for (var i = 0; i < 9; i++) {
    if (i == 0) {
      if (
        repeatcount(inventory)[1][0] > 0 &&
        repeatcount(inventory)[1][9] > 0 &&
        repeatcount(inventory)[1][10] > 0 &&
        repeatcount(inventory)[1][11] > 0 &&
        repeatcount(inventory)[1][12] > 0
      ) {
        ox = true
      }
    }
    if (
      repeatcount(inventory)[1][i] > 0 &&
      repeatcount(inventory)[1][i + 1] > 0 &&
      repeatcount(inventory)[1][i + 2] > 0 &&
      repeatcount(inventory)[1][i + 3] > 0 &&
      repeatcount(inventory)[1][i + 4] > 0
    ) {
      ox = true
    }
  }
  return ox
}

function isMissionSuccess(type, inventory): boolean {
  let TF: boolean = false
  switch (type) {
    case 'Onepair':
      TF = paircount(1, 2, inventory)
      break
    case 'Twopair':
      TF = paircount(2, 2, inventory)
      break
    case 'Flush':
      TF = oxFlush(inventory)
      break
    case 'Triple':
      TF = paircount(1, 3, inventory)
      break
    case 'Fourcard':
      TF = paircount(1, 4, inventory)
      break
    case 'Fullhouse':
      if (
        paircount(1, 3, inventory) == true &&
        paircount(1, 2, inventory) == true
      ) {
        TF = true
      }
    case 'Straight':
      TF = oxStraignt(inventory)
      break
  }
  return TF
}

export default isMissionSuccess
