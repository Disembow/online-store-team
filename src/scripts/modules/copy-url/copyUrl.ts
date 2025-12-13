export default function copyUrl(target: HTMLElement) {
  // Копирование ссылки
  navigator.clipboard.writeText(window.location.href);
  // Изменение состояния кнопки
  const textTarget = target.textContent;
  target.textContent = 'copied!';
  setTimeout(() => {
    target.textContent = textTarget;
  }, 1000);
}
