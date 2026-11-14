'use strict';
// This interaction explains a *proposed* architecture; it never calls an AI service.
const STAGES = Object.freeze({
  source: {
    number: '01',
    title: 'Approved company policies',
    text: 'Only owner-approved, currently effective policies are eligible. Keep personal employee records and confidential leadership materials out of the initial pilot. HR and IT owners approve content.',
    owner: 'Accountable: HR and IT policy owners'
  },
  prepare: {
    number: '02',
    title: 'Version, synchronize, and index',
    text: 'Verify policy version, effective date, approval status, and owner. Sync newly approved changes within one business day; quarantine conflicting or undated documents for human verification. IT maintains the ingestion and embeddings workflow.',
    owner: 'Accountable: IT operations and policy owners'
  },
  retrieve: {
    number: '03',
    title: 'Permission-aware retrieval and generation',
    text: 'Authenticate the employee, apply document-level permissions before retrieval, then pass only authorized passages to an approved LLM API. A retrieval index supports citations; this proposal does not require fine-tuning a foundation model.',
    owner: 'Accountable: IT engineering and Information Security'
  },
  answer: {
    number: '04',
    title: 'Cited answer with a human decision point',
    text: 'Return a grounded answer with source citations and acknowledge uncertainty. Employees can consult the original policy; sensitive or ambiguous questions are escalated to the responsible HR or IT policy owner.',
    owner: 'Accountable: Employee and subject-matter expert'
  }
});
const buttons = [...document.querySelectorAll('[data-step]')];
const tag = document.getElementById('detail-tag');
const title = document.getElementById('detail-title');
const copy = document.getElementById('detail-copy');
const owner = document.getElementById('detail-owner');
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const stage = STAGES[button.dataset.step];
    if (!stage || !tag || !title || !copy || !owner) return;
    buttons.forEach(other => {
      const active = other === button;
      other.classList.toggle('is-active', active);
      other.setAttribute('aria-pressed', String(active));
    });
    tag.textContent = `SELECTED · ${stage.number}`;
    title.textContent = stage.title;
    copy.textContent = stage.text;
    owner.textContent = stage.owner;
  });
});
