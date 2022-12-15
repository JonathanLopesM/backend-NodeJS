

async function TaxCalculate (req, res, next) {
  const { userId } = req
  const { annualIncome, health, dependents, spendingOnEducation, ContributionPGBL, INSS, withholdingTax } = req.body

  //Dependents Calc
  const dependentsCalc = dependents * 2275.08
  req.dependentsCalc = Number(dependentsCalc.toFixed(2))

  // Spending On Education Calc
  const MaxEducationCalc = 3561.50 * (dependents + 1)
  var EducationCalc = 0
  if(spendingOnEducation > MaxEducationCalc){
     EducationCalc = MaxEducationCalc
  } else {
     EducationCalc = spendingOnEducation
  }

  //PGBL Calc
  const MaxContributionPGBL = annualIncome * 0.12
  var PGBLCalc = 0
  if(ContributionPGBL > MaxContributionPGBL){
    PGBLCalc = MaxContributionPGBL
  } else {
    PGBLCalc = ContributionPGBL
  }

  //New Tax Base 
  const NewTaxBase = annualIncome - health - INSS - dependentsCalc -  PGBLCalc - EducationCalc
  req.NewTaxBase = Number(NewTaxBase.toFixed(2))
  console.log( annualIncome, health, dependents, spendingOnEducation, ContributionPGBL, INSS, withholdingTax, 'TaxCalculate')

  next()


}

export default TaxCalculate