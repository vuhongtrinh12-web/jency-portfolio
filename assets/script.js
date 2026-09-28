document.querySelector('.menu')?.addEventListener('click', () => document.querySelector('.navlinks')?.classList.toggle('open'));

function changeLanguage(lang) {
  if (!translations[lang]) lang = 'en';
  const dictionary = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const value = dictionary[element.dataset.i18n];
    if (value !== undefined) element.textContent = value;
  });
  document.querySelectorAll('[data-i18n-html]').forEach((element) => {
    const value = dictionary[element.dataset.i18nHtml];
    if (value !== undefined) element.innerHTML = value;
  });
  document.documentElement.lang = lang;
  localStorage.setItem('jency-language', lang);
  document.querySelectorAll('[data-lang]').forEach((button) => button.classList.toggle('active', button.dataset.lang === lang));
  const page = location.pathname.split('/').pop() || 'index.html';
  const meta = pageMeta[page]?.[lang];
  if (meta) {
    document.title = meta[0];
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', meta[1]);
  }
  const submitButton = document.querySelector('#project-submit');
  if (submitButton) submitButton.dataset.defaultLabel = submitButton.textContent;
}

document.querySelectorAll('[data-lang]').forEach((button) => button.addEventListener('click', () => changeLanguage(button.dataset.lang)));
changeLanguage(localStorage.getItem('jency-language') || 'en');

const projectForm = document.querySelector('#project-form');
if (projectForm) {
  const submitButton = projectForm.querySelector('#project-submit');
  const status = projectForm.querySelector('#form-status');
  projectForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const lang = localStorage.getItem('jency-language') || 'en';
    const messages = {
      en: { sending:'Sending...', success:'Project submitted successfully. Thank you — I’ll get back to you soon.', submitted:'Project Submitted ✓', error:'Something went wrong. Please try again or email jency.contact@gmail.com.' },
      vi: { sending:'Đang gửi...', success:'Dự án đã được gửi thành công. Cảm ơn bạn — tôi sẽ phản hồi sớm.', submitted:'Đã gửi dự án ✓', error:'Đã xảy ra lỗi. Vui lòng thử lại hoặc email đến jency.contact@gmail.com.' },
      ko: { sending:'전송 중...', success:'프로젝트 문의가 성공적으로 전송되었습니다. 감사합니다. 곧 답변드리겠습니다.', submitted:'전송 완료 ✓', error:'문제가 발생했습니다. 다시 시도하거나 jency.contact@gmail.com 으로 이메일을 보내주세요.' }
    }[lang];
    status.textContent = '';
    status.className = 'form-status';
    submitButton.disabled = true;
    submitButton.textContent = messages.sending;
    try {
      const response = await fetch(projectForm.action, { method:'POST', body:new FormData(projectForm), headers:{ Accept:'application/json' } });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Submission failed');
      status.textContent = messages.success;
      status.classList.add('success');
      submitButton.textContent = messages.submitted;
      projectForm.reset();
      setTimeout(() => { changeLanguage(lang); submitButton.disabled = false; }, 3500);
    } catch (error) {
      status.textContent = messages.error;
      status.classList.add('error');
      changeLanguage(lang);
      submitButton.disabled = false;
    }
  });
}
