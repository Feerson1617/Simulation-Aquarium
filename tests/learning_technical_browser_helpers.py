"""Reach the retained research/evidence interface through the actual teacher controls."""
def technical_start(page,grade,mission=None):
    page.locator('[data-learn="teacher"]').filter(visible=True).first.click()
    page.locator('[data-teacher="grade"]').select_option(str(grade))
    if mission:
        page.locator('[data-teacher="mission"]').select_option(mission)
    page.locator('[data-learn="'+('teacher-launch' if mission else 'teacher-free')+'"]').click()
    if mission:
        page.locator('[data-learn="close"]').filter(visible=True).first.click()
