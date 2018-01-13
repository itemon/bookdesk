
const allRequirements = (page) => {
  return {
    eat_date: page.data.checkedDate,
    eat_count: page.data.hcBase[page.data.hcCheckedIndex],
  }
}

module.exports.allRequirements = allRequirements;