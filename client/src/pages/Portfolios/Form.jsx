export default function Form(props) {
  return (
    <>
    <div className="cursor-pointer" onClick={() => props.showForm(!props.isShow)}>Yeni Portföy oluşturmak için tıklayın</div>
    {props.isShow &&
      <form className="w-full max-w-xl mx-auto" onSubmit={e => props.submitForm(e)}>
        <input
          type="text"
          placeholder="Portföy ismini yazın"
          onChange={e => props.handlePortfolioName(e)}
        />
        <button>test</button>
      </form>
    }
    </>
  )
}