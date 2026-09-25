document.querySelector('.menu')?.addEventListener('click',()=>document.querySelector('.navlinks')?.classList.toggle('open'));

const projectForm = document.querySelector('#project-form');
if (projectForm) {
  const submitButton = projectForm.querySelector('#project-submit');
  const status = projectForm.querySelector('#form-status');
  const defaultLabel = submitButton.textContent;

  projectForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';
    status.className = 'form-status';
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    try {
      const response = await fetch(projectForm.action, {
        method: 'POST',
        body: new FormData(projectForm),
        headers: { Accept: 'application/json' }
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Submission failed');

      status.textContent = 'Project submitted successfully. Thank you — I’ll get back to you soon.';
      status.classList.add('success');
      submitButton.textContent = 'Project Submitted ✓';
      projectForm.reset();
      setTimeout(() => { submitButton.textContent = defaultLabel; submitButton.disabled = false; }, 3500);
    } catch (error) {
      status.textContent = 'Something went wrong. Please try again or email vuhongtrinh12@gmail.com.';
      status.classList.add('error');
      submitButton.textContent = defaultLabel;
      submitButton.disabled = false;
    }
  });
}
