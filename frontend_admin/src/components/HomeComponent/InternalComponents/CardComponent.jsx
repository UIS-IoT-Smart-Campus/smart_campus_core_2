import './CardComponent.css'

function CardComponent({title, value}) {
  return (
    <div className='card col-sm-3 shadow-sm p-2 mb-5 bg-body rounded card-color'>
          <div className='card-body text-center '>
              <h5 className='card-title fw-semibold fs-3 mb-4'>{title}</h5>
              <hr/>
              <p className='mb-0 fw-normal fs-1'>{value}</p>
          </div>
    </div>
  )
}

export default CardComponent