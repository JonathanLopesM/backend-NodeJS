

async function TaxCalculate (req, res, next) {
  const { userId } = req
  const { annualIncome, health, dependents, education,alimony, acceptPgbl, inss, irOnFont  } = req.body
  // console.log(annualIncome, health, dependents, education,alimony, acceptPgbl, inss, irOnFont)
  // console.log(alimony ,'alimony teste')
  
  const annualIncomeDot = annualIncome.replace('.', '')
  const annualIncomeCorrect = Number(annualIncomeDot.replace(',', '.'))
  req.annualIncomeCorrect = annualIncomeCorrect

  const healthDot = health.replace('.', '')
  const healthCorrect = Number(healthDot.replace(',', '.'))
    req.healthCorrect=healthCorrect
  const dependentsDot = dependents.replace('.', '')
  const dependentsCorrect = Number(dependentsDot.replace(',', '.'))
    req.dependentsCorrect=dependentsCorrect
  const educationDot = education.replace( '.', '')
  const spendingOnEducation = Number(educationDot.replace(',', '.'))
    req.spendingOnEducation = spendingOnEducation
  const alimonyDot = alimony.replace('.', '')
  const Alimony = Number(alimonyDot.replace(',', '.'))
    req.Alimony = Alimony
  const acceptPgblDot = acceptPgbl.replace('.', '')
  const ContributionPGBL = Number(acceptPgblDot.replace(',', '.'))
    req.ContributionPGBL = ContributionPGBL
  const inssDot = inss.replace('.', '')
  const INSS = Number(inssDot.replace(',', '.'))
    req.INSS = INSS
  const IRDot = irOnFont.replace('.', '')
  const withholdingTax = Number(IRDot.replace(',', '.'))
    req.withholdingTax = withholdingTax

  //Dependents Calc
  let dependentsCalc = dependentsCorrect * 2275.08
  dependentsCalc = Number(dependentsCalc.toFixed(2))
  req.dependentsCalc = dependentsCalc
  // Spending On Education Calc
  const MaxEducationCalc = 3561.50 * (dependentsCorrect + 1)
  let EducationCalc = 0
  if(spendingOnEducation > MaxEducationCalc){
     EducationCalc = MaxEducationCalc
  } else {
     EducationCalc = spendingOnEducation
  }

  req.EducationCalc = EducationCalc

  //PGBL Calc
  const MaxContributionPGBL = annualIncomeCorrect * 0.12
  let PGBLCalc = 0
  if(ContributionPGBL > MaxContributionPGBL){
    PGBLCalc = MaxContributionPGBL
  } else {
    PGBLCalc = ContributionPGBL
  }
  req.PGBLCalc = PGBLCalc

  //New Tax Base 
  let NewTaxBase = annualIncomeCorrect - healthCorrect - INSS - dependentsCalc -  PGBLCalc - EducationCalc - Alimony
  NewTaxBase = Number(NewTaxBase.toFixed(2))
  req.NewTaxBase = NewTaxBase
  //Total Dedution
  let TotalDedution = healthCorrect + INSS + dependentsCalc +  PGBLCalc + EducationCalc + Alimony
  TotalDedution = Number(TotalDedution.toFixed(2))
  req.TotalDedution = TotalDedution


  // console.log(NewTaxBase)
  //Tax value to pay Init
  let taxFirst = 0
  let taxSecond = 0
  let taxThird = 0
  let taxFour = 0
  let taxFive = 0
  // Limits to values
  let CorrectAliquot=''
  let FirstAliquot = 0
  let SecondAliquot = 0
  let ThirdAliquot = 0
  let FourAliquot = 0
  let FiveAliquot = 0

  if(NewTaxBase <= 22847.75){
    FirstAliquot = NewTaxBase

  } else if(NewTaxBase <= 33919.80){
    FirstAliquot = 22847.76
    SecondAliquot = NewTaxBase - 22847.76
    taxSecond = SecondAliquot * 0.075
    CorrectAliquot= '7,5'
  }
  else if(NewTaxBase <= 45012.60){
    FirstAliquot = 22847.76
    SecondAliquot = NewTaxBase - 22847.76
    taxSecond = SecondAliquot * 0.075

    if(SecondAliquot < 11072.04){

        taxSecond = SecondAliquot * 0.075
      } else {
        SecondAliquot = 11072.04
        taxSecond = SecondAliquot * 0.075
      }
    ThirdAliquot = NewTaxBase - 33919.8
    if(ThirdAliquot < 11092.80){
      taxThird = ThirdAliquot * 0.15
      CorrectAliquot = '15,0'
    } else {
      taxThird = 11092.80
      taxThird = taxThird * 0.15
      CorrectAliquot = '15,0'
    }
    
    
  }else if (NewTaxBase <= 55976.16){
    FirstAliquot = 22847.76
    SecondAliquot = NewTaxBase - 22847.76
    taxSecond = SecondAliquot * 0.075

    if(SecondAliquot < 11072.04){
      taxSecond = SecondAliquot * 0.075
    } else {
      SecondAliquot = 11072.04
      taxSecond = SecondAliquot * 0.075
    }

  ThirdAliquot = NewTaxBase - 33919.8
  if(ThirdAliquot < 11092.80){
    taxThird = ThirdAliquot * 0.15
  } else {
    ThirdAliquot = 11092.80
    taxThird = ThirdAliquot * 0.15
  }

  FourAliquot = NewTaxBase - 45012.60
  if(FourAliquot < 10963.56){
    taxFour = FourAliquot * 0.225
    CorrectAliquot = '22,5'
  } else {
    FourAliquot = 10963.56
    taxFour = FourAliquot * 0.225
    CorrectAliquot = '22,5'
  }
  }
  else if(NewTaxBase >= 55976.17){

    FirstAliquot = 22847.76
    SecondAliquot = NewTaxBase - 22847.76
    taxSecond = SecondAliquot * 0.075

    if(SecondAliquot < 11072.04){
        taxSecond = SecondAliquot * 0.075
      } else {
        SecondAliquot = 11072.04
        taxSecond = SecondAliquot * 0.075
      }

    ThirdAliquot = NewTaxBase - 33919.8
    if(ThirdAliquot < 11092.80){
      taxThird = ThirdAliquot * 0.15
    } else {
      ThirdAliquot = 11092.80
      taxThird = ThirdAliquot * 0.15
    }

    FourAliquot = NewTaxBase - 45012.60
    if(FourAliquot < 10963.56){
      taxFour = FourAliquot * 0.225
    } else {
      FourAliquot = 10963.56
      taxFour = FourAliquot * 0.225
    }

    FiveAliquot = NewTaxBase - 55976.16
      taxFive= FiveAliquot * 0.275
      CorrectAliquot = '27,5'
    
  }
  let taxTotal = Number(taxFirst.toFixed(4)) + Number(taxSecond.toFixed(4)) + Number(taxThird.toFixed(4)) + Number(taxFour.toFixed(4)) + Number(taxFive.toFixed(4))
  taxTotal = Number(taxTotal.toFixed(2))
  console.log(taxTotal, 'taxTotal')
  req.taxTotal = taxTotal

  //Tax return 
  let BalanceRefounded = withholdingTax - taxTotal
  BalanceRefounded = Number((Math.abs(BalanceRefounded)).toFixed(2))
  req.BalanceRefounded = BalanceRefounded
  console.log(BalanceRefounded, 'Calc restituir')

  req.CorrectAliquot = CorrectAliquot
  let AliquoteEffect = (taxTotal *100) / annualIncomeCorrect
  AliquoteEffect = Number(AliquoteEffect.toFixed(2))
  req.AliquoteEffect = AliquoteEffect

  taxFirst=Number(taxFirst.toFixed(2))
    req.taxFirst = taxFirst
  taxSecond = Number(taxSecond.toFixed(2))
  req.taxSecond = taxSecond
  taxThird = Number(taxThird.toFixed(2))
  req.TaxThirdRate =  taxThird
   taxFour = Number(taxFour.toFixed(2))
  req.TaxFourRate = taxFour
    taxFive = Number(taxFive.toFixed(2))
  req.TaxFiveRate = taxFive

  FirstAliquot = Number(FirstAliquot.toFixed(2))
  SecondAliquot = Number(SecondAliquot.toFixed(2))
  ThirdAliquot=Number(ThirdAliquot.toFixed(2))
  FourAliquot =Number(FourAliquot.toFixed(2)) 
  FiveAliquot = Number(FiveAliquot.toFixed(2))
  req.FirstAliquot = FirstAliquot
  req.SecondAliquot = SecondAliquot
  req.ThirdAliquot = ThirdAliquot
  req.FourAliquot = FourAliquot
  req.FiveAliquot = FiveAliquot


  next()
}

export default TaxCalculate