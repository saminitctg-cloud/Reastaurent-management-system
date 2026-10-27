// Name: YOUR NAME | Roll No: YOUR ROLL NUMBER | Set: B

// Each dish is one object. Add or edit dishes in this list.
const menu = [
  { id: 'biryani', name: 'Chicken Biryani', category: 'Main course', price: 480, description: 'Fragrant rice, tender chicken and warming spices.', image: 'img/biryani.svg', alt: 'Illustration of chicken biryani' },
  { id: 'kacchi', name: 'Beef Kacchi', category: 'Main course', price: 650, description: 'Slow-cooked beef, aromatic rice and potato.', image: 'img/kacchi.svg', alt: 'Illustration of beef kacchi' },
  { id: 'ilish', name: 'Shorshe Ilish', category: 'Main course', price: 720, description: 'Hilsa fish in gently spiced mustard sauce.', image: 'img/ilish.svg', alt: 'Illustration of hilsa fish curry' },
  { id: 'puri', name: 'Dal Puri', category: 'Starters', price: 180, description: 'Golden puri with a comforting lentil dip.', image: 'img/puri.svg', alt: 'Illustration of golden dal puri' },
  { id: 'kebab', name: 'Chicken Kebab', category: 'Starters', price: 320, description: 'Char-grilled chicken with herbs and mint.', image: 'img/kebab.svg', alt: 'Illustration of grilled chicken kebab' },
  { id: 'doi', name: 'Mishti Doi', category: 'Desserts', price: 160, description: 'Creamy sweet yogurt made the traditional way.', image: 'img/doi.svg', alt: 'Illustration of mishti doi' },
  { id: 'roshogolla', name: 'Roshogolla (2 pcs)', category: 'Desserts', price: 140, description: 'Soft cottage-cheese sweets in light syrup.', image: 'img/roshogolla.svg', alt: 'Illustration of roshogolla sweets' }
];

// toFixed(2) makes every amount show two digits after the decimal point.
function money(amount) {
  return Number(amount).toFixed(2);
}

// This part runs only on index.html, which contains the menu list.
const menuList = document.querySelector('#menu-list');
if (menuList) {
  let cart = {};

  // Restore the saved cart. An empty cart is used if storage is unavailable or unreadable.
  try {
    cart = JSON.parse(localStorage.getItem('spiceGardenCart')) || {};
  } catch (error) {
    cart = {};
  }

  // Make one menu section for each category in the menu array.
  const categories = [...new Set(menu.map(dish => dish.category))];
  categories.forEach(category => {
    const section = document.createElement('section');
    section.className = 'menu-category';

    const heading = document.createElement('h3');
    heading.textContent = category;

    const grid = document.createElement('div');
    grid.className = 'menu-grid';

    const categoryDishes = menu.filter(dish => dish.category === category);
    categoryDishes.forEach(dish => {
      const card = document.createElement('article');
      card.className = 'dish-card';
      card.innerHTML = `
        <div class="dish-image">
          <img src="${dish.image}" alt="${dish.alt}">
          <span class="price">BDT ${dish.price}</span>
        </div>
        <div class="dish-copy">
          <h4>${dish.name}</h4>
          <p>${dish.description}</p>
          <button class="add-button" data-add="${dish.id}" type="button">Add to order</button>
        </div>`;
      grid.append(card);
    });

    section.append(heading, grid);
    menuList.append(section);
  });

  function renderCart() {
    const cartBox = document.querySelector('#cart-items');
    cartBox.replaceChildren();

    const chosenDishes = menu.filter(dish => cart[dish.id]);
    const itemCount = chosenDishes.reduce((sum, dish) => sum + cart[dish.id], 0);
    document.querySelector('#cart-count').textContent = `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;

    if (chosenDishes.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = 'Your cart is empty. Add something tasty from the menu.';
      cartBox.append(emptyMessage);
    }

    chosenDishes.forEach(dish => {
      const row = document.createElement('div');
      row.className = 'cart-row';
      row.innerHTML = `
        <div><strong>${dish.name}</strong><small>BDT ${money(dish.price)} each</small></div>
        <div class="quantity">
          <button type="button" data-change="${dish.id}" data-by="-1" aria-label="Remove one ${dish.name}">−</button>
          <span>${cart[dish.id]}</span>
          <button type="button" data-change="${dish.id}" data-by="1" aria-label="Add one ${dish.name}">+</button>
        </div>
        <b>BDT ${money(dish.price * cart[dish.id])}</b>`;
      cartBox.append(row);
    });

    const subtotal = chosenDishes.reduce((sum, dish) => sum + dish.price * cart[dish.id], 0);
    const discount = subtotal > 1000 ? subtotal * 0.10 : 0;
    const vat = (subtotal - discount) * 0.05;
    const total = subtotal - discount + vat;

    document.querySelector('#subtotal').textContent = money(subtotal);
    document.querySelector('#discount').textContent = money(discount);
    document.querySelector('#discount-line').hidden = discount === 0;
    document.querySelector('#vat').textContent = money(vat);
    document.querySelector('#total').textContent = money(total);
  }

  function changeQuantity(dishId, changeBy) {
    cart[dishId] = (cart[dishId] || 0) + changeBy;
    if (cart[dishId] <= 0) {
      delete cart[dishId];
    }

    localStorage.setItem('spiceGardenCart', JSON.stringify(cart));
    renderCart();
  }

  // One listener handles every add and quantity button (event delegation).
  document.addEventListener('click', event => {
    const addButton = event.target.closest('[data-add]');
    const quantityButton = event.target.closest('[data-change]');

    if (addButton) {
      changeQuantity(addButton.dataset.add, 1);
    }
    if (quantityButton) {
      changeQuantity(quantityButton.dataset.change, Number(quantityButton.dataset.by));
    }
  });

  renderCart();
}

// The booking checks run only on reservation.html.
const reservationForm = document.querySelector('#reservation-form');
if (reservationForm) {
  const submitButton = document.querySelector('#submit-reservation');
  const errorBox = document.querySelector('#form-errors');
  const today = new Date();
  const todayText = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  reservationForm.elements.date.min = todayText;

  function getReservationErrors() {
    const errors = [];
    const name = reservationForm.elements.name.value.trim();
    const phone = reservationForm.elements.phone.value.trim().replace(/[\s-]/g, '');
    const date = reservationForm.elements.date.value;
    const time = reservationForm.elements.time.value;
    const guests = Number(reservationForm.elements.guests.value);

    if (name.length < 2) {
      errors.push('Please enter your name (at least 2 characters).');
    }
    // Bangladesh mobile numbers may be entered as 01XXXXXXXXX or +8801XXXXXXXXX.
    if (!/^(?:\+?8801|01)[3-9]\d{8}$/.test(phone)) {
      errors.push('Enter a valid Bangladesh mobile number, such as 01712345678.');
    }
    if (!date) {
      errors.push('Please choose a reservation date.');
    } else if (date < todayText) {
      errors.push('The reservation date cannot be in the past.');
    }
    if (!time) {
      errors.push('Please choose a reservation time.');
    }
    if (!Number.isInteger(guests) || guests < 1 || guests > 12) {
      errors.push('Choose between 1 and 12 guests.');
    }
    return errors;
  }

  function updateForm() {
    const requiredFields = ['name', 'phone', 'date', 'time', 'guests'];
    const allFieldsFilled = requiredFields.every(fieldName => {
      return String(reservationForm.elements[fieldName].value).trim() !== '';
    });
    submitButton.disabled = !allFieldsFilled;

    errorBox.replaceChildren();
    if (reservationForm.dataset.submitted === 'true') {
      const errors = getReservationErrors();
      if (errors.length > 0) {
        const list = document.createElement('ul');
        errors.forEach(message => {
          const item = document.createElement('li');
          item.textContent = message;
          list.append(item);
        });
        errorBox.append(list);
      }
    }
  }

  reservationForm.addEventListener('input', () => {
    reservationForm.dataset.submitted = 'false';
    document.querySelector('#confirmation').hidden = true;
    updateForm();
  });
  reservationForm.addEventListener('change', updateForm);

  reservationForm.addEventListener('submit', event => {
    event.preventDefault();
    reservationForm.dataset.submitted = 'true';
    const errors = getReservationErrors();
    updateForm();

    if (errors.length > 0) {
      return;
    }

    const formData = new FormData(reservationForm);
    const confirmation = document.querySelector('#confirmation');
    confirmation.replaceChildren();

    const heading = document.createElement('h3');
    heading.textContent = 'Your table request is ready!';
    const details = document.createElement('p');
    details.textContent = `Thank you, ${formData.get('name').trim()}. We noted ${formData.get('guests')} guest(s) on ${formData.get('date')} at ${formData.get('time')}.`;

    const preferences = formData.getAll('preferences');
    const note = document.createElement('p');
    note.textContent = preferences.length > 0
      ? `Preferences: ${preferences.join(', ')}. See you at Spice Garden!`
      : 'We look forward to seeing you at Spice Garden.';

    confirmation.append(heading, details, note);
    confirmation.hidden = false;
    confirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  updateForm();
}
