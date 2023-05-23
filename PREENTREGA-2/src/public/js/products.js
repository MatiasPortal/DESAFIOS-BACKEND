
const buttonAdd = async(obj) => {
    const pid = obj.getAttribute("pid");
    console.log(pid);
    const URL = `/api/carts/6467ef65e36657ed6111e4fd/product/${pid}`;
    const res = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await res.json();
    console.log(data);

    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Se agrego el producto al carrito',
        showConfirmButton: false,
        timer: 1500
      })
} 

